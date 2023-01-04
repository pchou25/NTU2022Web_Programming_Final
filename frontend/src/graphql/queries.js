import { gql } from '@apollo/client';

export const getDepot_query = gql`
query getDepot($username: String! ,$password:String! ) {
  getDepot(username:$username , password:$password){
    username
    password
    files{
      filename
      url
    }
    }
  }
`;
export const getFile_query = gql`
query getFile {
  getFile
  }
`;
