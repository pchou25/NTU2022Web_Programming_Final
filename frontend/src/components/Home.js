import { useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';

import { getDepot_query } from '../graphql/queries';
import { DELETE_ITEM_MUTATION } from '../graphql/mutations';
import Title from './Title';
import Row from './Row';
import InputWithIcon from './Login';
import { ITEM_SUBSCRIPTION } from '../graphql/subscriptions';
const U_KEY = "usrname";
const P_KEY = "pwdkey";
const savedUsr = localStorage.getItem(U_KEY);
const savedKey = localStorage.getItem(P_KEY);

function Home({ Logout, setLogout, username, setUsername, password, setPassword,setErrmsg , setErrmsgstr }) {

    const [login, setLogin] = useState(savedUsr && savedKey ? true : false);
    const [open, setOpen] = useState(false);

    const [getDepot, {
        loading, error, data: itemsData, subscribeToMore,
    }] = useLazyQuery(getDepot_query);
    var unsubs = null;
    useEffect(
        () => {
            if (loading) return;
            try {
                if(unsubs){
                    unsubs();
                    // console.log('unsubs ')
                }
                // console.log('create subs ' , unsubs)
                unsubs = subscribeToMore({
                    document: ITEM_SUBSCRIPTION,
                    variables: {
                        username,
                        password
                    },
                    updateQuery: (prev, { subscriptionData }) => {
                        console.log('subs',subscriptionData.data)
                        if (!subscriptionData.data) return prev;
                        if (subscriptionData.data.subscribeDepot.isAdd) {
                            if (!prev || !prev.getDepot || !prev.getDepot.files) return {
                                getDepot: { files: [subscriptionData.data.subscribeDepot.file], username, password }

                            };
                            return {
                                getDepot: { files: [subscriptionData.data.subscribeDepot.file, ...prev.getDepot.files], username, password },

                            }
                        } else {
                            if (!prev || !prev.getDepot || !prev.getDepot.files) {
                                return { getDepot: { files: [], username, password } };
                            }
                            var index = -1;
                            for (let i = 0; i < prev.getDepot.files.length; i++) {
                                if (prev.getDepot.files[i].url == subscriptionData.data.subscribeDepot.file.url) {
                                    index = i;
                                    break;
                                }
                            }
                            if (index !== -1) {
                                var newarr = [...prev.getDepot.files];
                                newarr.splice(index, 1);
                                return { getDepot: { files: newarr, username, password } };
                            } else return prev;
                        }
                    },
                });
            } catch (e) {
                unsubs();
                return;
            }
            return ()=>unsubs();
        },
        [subscribeToMore, loading],
    );
    useEffect(() => {
        if (username && password) {
            setOpen(false);
            setLogin(true);
        } else {
            setOpen(true);
        }
    }, [])
    useEffect(() => {
        if (Logout) {
            setLogout(false);
            setLogin(false);
            setUsername("");
            setPassword("");
            localStorage.setItem(U_KEY, username);
            localStorage.setItem(P_KEY, password);
        }
    }, [Logout])
    useEffect(() => {
        if (!login && !(username && password)) {
            setOpen(true);
        }
        else {
            getDepot({
                variables: {
                    username,
                    password,
                },
                onError:()=>{
                    setErrmsg(true);
                    setErrmsgstr('Backend server not connected.');
                }
            });
            localStorage.setItem(U_KEY, username);
            localStorage.setItem(P_KEY, password);
            setOpen(false);
        }
    }, [login])


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteItem] = useMutation(DELETE_ITEM_MUTATION);


    if (loading) return <p>Loading...</p>;
    if (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        // return (<p>Error :(</p>);
    }

    if (!error && itemsData) var items = itemsData.getDepot.files;
    else items = [{ id: 'Nodata', date: 111, __typename: '---', filename: '---', url: 'test' }]
    console.log('itemdata:',items);
    const sortedItems = items.slice().sort();

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (

        <Paper className="p-4">
            <Title>ClipBoard</Title>
            <InputWithIcon props={{ open, username, setUsername, password, setPassword, login, setLogin }}></InputWithIcon>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell variant="head">FileName</TableCell>
                        <TableCell variant="head">Type</TableCell>
                        {/* <TableCell variant="head" align="right">Amount</TableCell>
            <TableCell variant="head">Category</TableCell>*/}
                        <TableCell variant="head" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((item) => (
                            <Row
                                key={item.url}
                                item={item}
                                deleteItem={deleteItem}
                                username={username}
                                password={password}
                            />
                        ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={items.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </Paper>
    );
}

export default Home;
