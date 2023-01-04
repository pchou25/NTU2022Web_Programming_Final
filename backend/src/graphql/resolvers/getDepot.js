const getDepot = async (
    _,
    { username, password },
    { GraphQLError, DepotModel, pubsub, secretHash }
) => {
    if (process.env.NODE_ENV !== "production") {
        console.log(`backend/src/graphql/resolvers/getDepot.js ${username} ${password}`);
    }

    const hashedPassword = secretHash(username, password);

    let depot = await DepotModel.findOne({ username });
    if (!depot)
        depot = await new DepotModel({ username, password: hashedPassword }).save();
    else if (depot.password !== hashedPassword) {
        throw new GraphQLError('Password incorrect!!', {
            extensions: { code: 'PASSWORD_INCORRECT' },
        });
    }
    return depot;
};
export default getDepot;