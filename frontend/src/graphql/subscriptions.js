import { gql } from '@apollo/client';

export const ITEM_SUBSCRIPTION = gql`
  subscription subscribeDepot($username:String!,$password:String!) {
    subscribeDepot(username:$username , password:$password){
        file{
          filename
          url
        }
        isAdd
    }
  }
`;
