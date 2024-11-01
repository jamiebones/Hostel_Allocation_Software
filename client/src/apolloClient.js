import {
  InMemoryCache,
  ApolloClient,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import store from "store";

const cache = new InMemoryCache({
  possibleTypes: {
    LoginUserResult: ["User", "Error"],
    //ActiveExamDetails: ["ActiveExamSuccessful", "Error"],
    //ExamTakenDetails: ["ExamTakenSuccess", "Error"],
  },
});

const port = process.env.PORT || 8000;

let httpLink = new HttpLink({ uri: `http://localhost:${port}/graphql` });

if (process.env.NODE_ENV === "production") {
  httpLink = new HttpLink({
    uri: `https://${window.location.hostname}/graphql`,
  });
}

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path }) => {
      if (message.includes("logout")) {
        store.clearAll();
        window.location.reload();
      }
      console.log(`[GraphQL Errors ] Message: ${message} Path: ${path}`);
    });
  }

  if (networkError) {
    console.log([
      `[network error] Message: ${networkError.message} Operation: ${operation.operationName}`,
    ]);
  }
});

const authLink = setContext((_, { headers, ...rest }) => {
  const token = store.get("authToken");
  const userIdentity = store.get("userIdKey");

  const context = {
    ...rest,
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      identity: userIdentity,
    },
  };
  return context;
});

//this is to remove __typename field from the mutation
const cleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key, value) =>
      key === "__typename" ? undefined : value;
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      omitTypename
    );
  }
  return forward(operation).map((data) => {
    return data;
  });
});

//create afterware to handle response object
const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const authHeader = context.response.headers.get("Authorization");
    if (authHeader) {
      store.set("authToken", authHeader);
    }
    return response;
  });
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    cleanTypeName,
    errorLink,
    authLink,
    afterwareLink.concat(httpLink),
  ]),
});

export default client;
