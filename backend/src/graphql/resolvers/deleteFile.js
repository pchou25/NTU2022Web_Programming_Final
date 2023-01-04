import * as fs from "fs";

const deleteFile = async (
    _,
    { username, password, filename },
    { GraphQLError, DepotModel, pubsub, secretHash }
) => {
    if (process.env.NODE_ENV !== "production") {
        console.log('backend/src/graphql/resolvers/deleteFile.js', username, password, filename);
    }
    const hashedPassword = secretHash(username, password);

    const result = await DepotModel.findOneAndUpdate({ username, password: hashedPassword }, {
        $pull: {
            files: { filename },
        },
    });

    if (!result || result.files.length === 0) {
        throw new GraphQLError('No such file.', {
            extensions: { code: 'FILE_NOT_FOUND' },
        });
    }
    
    var url;
    for (var i in result.files) {
        if (result.files[i].filename === filename) {
            url = result.files[i].url;
            break;
        }
    }

    if (process.env.NODE_ENV !== "production") {
        console.log('backend/src/graphql/resolvers/deleteFile.js', result.files, url);
    }

    fs.unlink('./files/' + url, (err) => err && console.error(err));

    pubsub.publish(
        `depot ${username}`,
        {
            subscribeDepot: {
                file: {
                    filename: filename,
                    url: url
                },
                isAdd: false,
            },
        },
    );

    return filename;
};
export default deleteFile;