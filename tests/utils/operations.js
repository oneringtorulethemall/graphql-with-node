import { gql } from 'apollo-boost';

/* #region user operations */
const createUser = gql`
    mutation($data:CreateUserInput!) {
        createUser( data: $data){
            token,
            user { id name email password }
        }
    }
`;

const login = gql`
    mutation($data: LoginUserInput!) {
        login (data : $data) {
            token
        }
    }
`;

const getProfile = gql`
    query {
        me {
            id
            name 
            email 
            password
        }
    }
`;

const getUsers = gql`
    query {
        users {
            id 
            name
            email
        }
    }
`;

/* #endregion */


/* #region post operations */

const getPost = gql`
    query( $id: ID!) {
        post( id: $id ) {
            id
            title
            body
            published
        }
    }
`;

const getPosts = gql`
    query {
        posts {
            id
            title
            body
            published
        }
    }
`;

const getMyPosts = gql`
    query
    {  
        myposts 
        {
            id 
            title
            body
            published 
            author {
                id
                name
            }
        }
    }
`;

const updatePost = gql`
    mutation( $id: ID!, $data: UpdatePostInput!) {
        updatePost(
            id: $id,
            data: $data
        )
        {
            id 
            title
            body
            published
        }
    }
`;

const createPost = gql`
    mutation($data: CreatePostInput!) {
        createPost( 
            data: $data
        )
        {
            id
            title
            body
            published 
        }
    }
`;

const deletePost = gql`
    mutation($id: ID!) {
        deletePost( id: $id)
        {
            id
        }
    }
`;

const subscribeToPosts = gql`
    subscription  {
        post {
            mutation
            node {
                id
                title
            }
        }
    }
`;

const deleteComment = gql`
    mutation($id: ID!) {
        deleteComment( id: $id) 
        {
            id
        }
    }
`;

const updateComment = gql`
    mutation($data: UpdateCommentInput!) {
        id
        text 
    }
`;

const createComment = gql`
    mutation($data: CreateCommentInput) {
        id 
        text
    }
`;

const getComments = gql`
    query {
        comments 
        { id text }
    }
`;

const subscribeToComments = gql`
    subscription($postID: ID!) {
        comment(postID: $postID) {
            mutation
            node {
                id
                text
                createdAt
            }
        }
    }
`;


/* #endregion */

export {
    createUser, login, getProfile, getUsers,
    getPost, getPosts, getMyPosts, updatePost, createPost, deletePost,
    getComments, createComment, updateComment, deleteComment,
    subscribeToPosts, subscribeToComments
}

