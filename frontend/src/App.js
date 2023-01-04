import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppFrame from './components/AppFrame';
import Home from './components/Home';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styled from 'styled-components';
import { FileUploader } from "react-drag-drop-files";
import './index.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CREATE_ITEM_MUTATION } from './graphql/mutations';
import { useMutation } from '@apollo/client';
import Alert from '@mui/material/Alert';
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});
const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});
const U_KEY = "usrname";
const P_KEY = "pwdkey";
const savedUsr = localStorage.getItem(U_KEY);
const savedKey = localStorage.getItem(P_KEY);
const fileup = styled(FileUploader)`
  color: white;
`;


const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
const cut = (text) => {
    return text.slice(text.indexOf(',', -1));
};

function App() {
    const [Logout, setLogout] = useState(false);
    const [username, setUsername] = useState(savedUsr || "");
    const [password, setPassword] = useState(savedKey || "");
    const [drag, setDrag] = useState(false);
    const [errmsg, setErrmsg] = useState(false);
    const [errmsgstr, setErrmsgstr] = useState("");
    const [upload] = useMutation(CREATE_ITEM_MUTATION);
    useEffect(() => {
        if (errmsg) {
            const timer = setTimeout(() => {
                setErrmsg(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errmsg])
    const handleDrop = async (e) => {
        e.preventDefault();
        setDrag(false);
        let file = await e.dataTransfer.items[0].getAsFile();
        console.log('up1', e.dataTransfer.items)
        console.log('upup', file)
        var content = cut(await toBase64(file));
        console.log(content)
        upload({
            variables: {
                username,
                password,
                filename: file.name,
                content: content
            },
            onError: (e) => {
                console.log("file too large")
                setErrmsg(true);
                setErrmsgstr('Upload failed.  Maybe try a smaller file ?');
            }
        });
    };
    const handleClick = async (e) => {
        var content = cut(await toBase64(e.target.files[0]));
        console.log('upup', e.target.files[0], content)
        try {
            upload({
                variables: {
                    username,
                    password,
                    filename: e.target.files[0].name,
                    content: content
                },
                onError: (e) => {
                    console.log("file too large")
                    setErrmsg(true);
                    setErrmsgstr('Upload failed.  Maybe try a smaller file ?');
                }
            });
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AppFrame setLogout={setLogout} Logout={Logout} username={username} />} >
                        <Route path="/" element={<>
                            <Home setLogout={setLogout} Logout={Logout} username={username} 
                            setUsername={setUsername} password={password} setPassword={setPassword} 
                            setErrmsg={setErrmsg} setErrmsgstr={setErrmsgstr}/>
                            <Box align='center' m={5} height='16vh'>
                                <Button
                                    variant="contained"
                                    style={{ textTransform: 'none' }}
                                    component="label"
                                    color={!drag ? 'primary' : 'success'}
                                    onDragOver={(ev) => { ev.preventDefault(); setDrag(true); }}
                                    onDragLeave={(ev) => { setDrag(false); }}
                                    onDrop={handleDrop}
                                >
                                    Upload or Drop a File Here
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleClick}

                                    />
                                </Button>
                            </Box>
                            {<Box sx={{display:'flex',
                            justifyContent: 'center' ,
                            transition: "all 0.5s ease-in-out",
                            visibility:errmsg?'visible':'hidden',
                            opacity:errmsg?1:0,
                            }}>
                                <Alert severity="error" align='center' sx={{ display:'flex',
                                 }} theme={lightTheme}>
                                {errmsgstr}
                            </Alert> </Box>
                            }
                        
                        </>}
                        />
                    <Route path="*" element={<h1>Error, Page Not Found</h1>} />
                </Route>
            </Routes>
        </BrowserRouter>
        </ThemeProvider >
    );
}

export default App;
