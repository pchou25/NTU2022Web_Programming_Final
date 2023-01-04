import * as React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'spaceBetween'
};
const style2 = {
    display: 'flex',
    top: '50%'
};
export default function InputWithIcon(props) {
    const { open, login, setLogin, setUsername, setPassword } = props.props;
    const handleOpen = () => setLogin(true);
    const handleClose = () => setLogin(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [usr, setUsr] = useState("");
    const [pwd, setPwd] = useState("");
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <Modal
            open={open}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >

            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Login
                </Typography>

                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <Box sx={style2}>
                        <InputLabel htmlFor="input-with-adornment">
                            Account
                        </InputLabel>
                        <Input
                            id="input-with-adornment"
                            startAdornment={
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            }
                            onChange={(e) => (setUsr(e.target.value))}
                        />
                    </Box>
                    <Box sx={style2}>
                        <FormControl sx={{ marginLeft: 0, marginBottom: 1, width: '25ch' }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                onChange={(e) => (setPwd(e.target.value))}
                            />
                        </FormControl>
                    </Box>
                    <Box sx={{ flexDirection: 'column-reverse' }}>
                        <Button variant="contained" onClick={() => {
                            setLogin(true);
                            setPassword(pwd);
                            setUsername(usr);
                        }}>Submit</Button>
                    </Box>
                </FormControl>
            </Box>
        </Modal>
    );
}