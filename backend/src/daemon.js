import * as fs from "fs";
const expireHour = 6;
const daemon = (pubsub, DepotModel) => {
    // DepotModel.deleteMany({}, () => { console.log('backend/src/daemon.js DB cleared.') });
    // don't clear db in deployment
    setInterval(async () => {
        const expire = new Date(new Date().setHours(new Date().getHours() - expireHour)).toISOString()
        const result = await DepotModel.find({
            files: {
                "$elemMatch": {
                    createdAt: {
                        $lte: expire
                    }
                }
            }
        })

        if (process.env.NODE_ENV !== "production") {
            console.log('backend/src/daemon.js', result);
        }

        for (var i in result) {
            const username = result[i].username;
            for (var j in result[i].files) {
                const filename = result[i].files[j].filename;
                const url = result[i].files[j].url;
                fs.unlink('./files/' + result[i].files[j].url, (err) => err && console.error(err));
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
            }
        }
        await DepotModel.deleteMany({
            files: {
                "$elemMatch": {
                    createdAt: {
                        $lte: expire
                    }
                }
            }
        });
    }, 1000 * 60 * 60 * expireHour);
}
export default daemon;