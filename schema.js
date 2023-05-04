import{ gql }  from "apollo-server";

export const typeDefs = gql`
  enum Status {
    PENDING
    PAID
    IN_PROGRESS
    IN_DELIVERY
    DELIVERED
  }

  type Order {
    id: ID!
    deliveryAddress: String!
    items: [String!]!
    total: Float!
    discountCode: String
    comment: String
    status: Status!
  }

  type Query {
    orders(status: Status): [Order!]!
    order(id: String): Order!
  }

  type Mutation {
    updateStatus(input: UpdateStatusInput): Order
    createOrder(input: CreateOrderInput!): Order
  }

  input UpdateStatusInput {
  id: ID!
  status: Status!
}

input CreateOrderInput {
    deliveryAddress: String!
    items: [String!]!
    total: Float!
    discountCode: String
    comment: String
    status: Status!
}
`;

// module.exports = typeDefs;