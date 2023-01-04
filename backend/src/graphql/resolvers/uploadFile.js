import * as fs from "fs";
const maxSize = ((1<<20) * 5 + 87)*4/3; // Approximate 5MB

const uploadFile = async (
    _,
    { username, password, filename, content },
    { GraphQLError, DepotModel, pubsub, secretHash }
) => {
    if (process.env.NODE_ENV !== "production") {
        console.log('backend/src/graphql/resolvers/uploadFile.js', username, password, filename);
    }


    if (content.length > maxSize) {
        throw new GraphQLError('File too large!!', {
            extensions: { code: 'FILE_TOO_LARGE' },
        });
    }

    const hashedPassword = secretHash(username, password);
    let depot = await DepotModel.findOne({ username, password: hashedPassword });
    if (!depot) {
        throw new GraphQLError('No such user!!', {
            extensions: { code: 'USER_NOT_FOUND' },
        });
    }
    else if (depot.files.some(({ filename: f }) => (f === filename))) {
        throw new GraphQLError('File exists!!', {
            extensions: { code: 'FILE_EXISTS' },
        });
    }

    const secretSalt = Math.random().toString();
    const url = "file-" + secretHash(filename, username + secretSalt);

    var buf = Buffer.from(content, 'base64');
    await fs.writeFile('./files/' + url, buf, (err) => {
        if (err) {
            console.log('backend/src/graphql/resolvers/uploadFile.js', err);
        }
        else if (process.env.NODE_ENV !== "production") {
            console.log(`backend/src/graphql/resolvers/uploadFile.js ${url} complete.`);
        }
    });

    DepotModel.findOneAndUpdate(
        { _id: depot._id },
        { $push: { files: { filename, url } } },
        (err) => {
            if (err)
                console.log('backend/src/graphql/resolvers/uploadFile.js', err);
        }
    );

    pubsub.publish(
        `depot ${username}`,
        {
            subscribeDepot: {
                file: {
                    filename: filename,
                    url: url
                },
                isAdd: true,
            },
        },
    );

    return content;
};
export default uploadFile;