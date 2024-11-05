# #!/bin/bash

# echo "Waiting 20 seconds for MongoDB instances to start..."
# sleep 20

# # Retry function to check MongoDB connection
# function wait_for_mongo() {
#   until mongosh --host mongo1 --eval "print(\"MongoDB is available\")" &>/dev/null; do
#     echo "Waiting for mongo1 to be ready..."
#     sleep 5
#   done
# }

# # Wait for MongoDB nodes to start and become reachable
# wait_for_mongo

# # Initialize the replica set with retries
# echo "Initializing MongoDB replica set..."
# until mongosh --host mongo1 --eval 'rs.initiate({
#   _id: "rs0",
#   members: [
#     { _id: 0, host: "mongo1:27017" },
#     { _id: 1, host: "mongo2:27017" },
#     { _id: 2, host: "mongo3:27017" }
#   ]
# })' || sleep 5; do
#   echo "Retrying replica set initiation..."
# done

# # Confirm replica set status
# echo "Replica set initiated. Checking status..."
# mongosh --host mongo1 --eval 'rs.status()'

#!/bin/bash

echo "Waiting 20 seconds for MongoDB instances to start..."
sleep 20

# Retry function to check MongoDB connection
function wait_for_mongo() {
  until mongosh --host mongo1 --eval "print(\"MongoDB is available\")" &>/dev/null; do
    echo "Waiting for mongo1 to be ready..."
    sleep 5
  done
}

# Wait for MongoDB nodes to start and become reachable
wait_for_mongo

# Initialize the replica set with retries
echo "Initializing MongoDB replica set..."
until mongosh --host mongo1 --eval 'rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})' || sleep 5; do
  echo "Retrying replica set initiation..."
done

# Confirm replica set status
echo "Replica set initiated. Checking status..."
mongosh --host mongo1 --eval 'rs.status()'

# Wait for the primary node to be elected
echo "Waiting for primary node election..."
sleep 10

# Create admin user
echo "Creating admin user..."
mongosh --host mongo1 --eval '
  db = db.getSiblingDB("admin");
  db.createUser({
    user: "admin",
    pwd: "blazing147_DB",
    roles: [{ role: "root", db: "admin" }]
  });
'

echo "Admin user created successfully."