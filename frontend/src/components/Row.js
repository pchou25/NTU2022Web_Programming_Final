import { useState } from 'react';
import PropTypes from 'prop-types';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import hostinfo from '../backendhost.json'

const dlserver = `http://${hostinfo.host}:${hostinfo.port}/`

function Row({
    item, deleteItem, username, password
}) {
    const [descriptionOpen, setDescriptionOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const onCollapse = () => {
        setDescriptionOpen((open) => !open);
    };

    const onEdit = () => {
        setEditOpen((open) => !open);
    };

    const handleDelete = () => {
        console.log('del!', {
            username,
            password,
            filename: item.filename
        },)
        deleteItem({
            variables: {
                username,
                password,
                filename: item.filename
            },
            onError: (err) => {
                console.error(err);
            },
        });

    };

    const onDownload = () => {
        const link = document.createElement("a");
        link.download = `download.txt`;
        link.href = "./download.txt";
        link.click();
    };
    return (
        <>
            <TableRow data-cy="item" key={item.url} hover>
                <TableCell onClick={onCollapse} sx={{ cursor: 'pointer' }}>
                    <Typography>{item.filename}</Typography>
                </TableCell>
                <TableCell data-cy="item-name" onClick={onCollapse} sx={{ cursor: 'pointer' }}>
                    <Typography>{item.__typename}</Typography>
                </TableCell>
                <TableCell align="right" data-cy="item-edit">
                    <IconButton data-cy="download-item" target="_blank" rel="noopener noreferrer"
                        href={dlserver + 'download?' + `filename=${item.url}&as=${item.filename}`}
                        // onClick={console.log(dlserver + 'download?' + `filename=${item.url}&as=${item.filename}`)}
                        >
                        <DownloadIcon />
                    </IconButton>
                    <IconButton onClick={handleDelete} data-cy="delete-item">
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow key={`${item.url}-descriptions`}>
                <TableCell colSpan={5} style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Collapse in={descriptionOpen} timeout="auto" unmountOnExit>
                        <div className="p-4">
                            <Typography gutterBottom>
                                Descriptions
                            </Typography>
                            <Typography variant="subtitle2" sx={{ textIndent: '1rem' }}>{item.description || 'No description'}</Typography>
                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

Row.propTypes = {
    item: PropTypes.shape({
        url: PropTypes.string.isRequired,
        filename: PropTypes.string.isRequired,
        __typename: PropTypes.string.isRequired,
    }).isRequired,
};

export default Row;
