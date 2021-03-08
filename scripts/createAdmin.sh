
#!/bin/bash


mongo <<EOF
   use admin;
   admin = db.getSiblingDB("admin");
   admin.createUser(
     {
	user: "admin",
        pwd: "blazing147server",
        roles: [ { role: "root", db: "admin" } ]
     });
     db.getSiblingDB("admin").auth("admin", "blazing147server");
     rs.status();
EOF
