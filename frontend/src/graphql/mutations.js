import { gql } from '@apollo/client';

export const CREATE_ITEM_MUTATION = gql`
  mutation uploadFile($username: String! , $password:String! , $filename:String! , $content:String!) {
    uploadFile(username: $username , password:$password , filename:$filename , content:$content)
  }
`;
export const DELETE_ITEM_MUTATION = gql`
  mutation deleteFile($username: String! , $password:String! , $filename:String! ) {
    deleteFile(username: $username , password:$password , filename:$filename )
  }
`;
