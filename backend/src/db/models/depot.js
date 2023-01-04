import mongoose from 'mongoose';
const Schema = mongoose.Schema
const DepotModelSchema = new Schema({
    username: {
        type: String,
        required:
            [true, 'Name field is required.']
    },
    password: {
        type: String,
        required:
            [true, 'Password field is required.']
    },
    files: [
        {
            type: new mongoose.Schema(
                {
                    filename: {
                        type: String,
                        required:
                            [true, 'Password field is required.']
                    },
                    url: {
                        type: String, required:
                            [true, 'Password field is required.']
                    },
                },
                { timestamps: true }
            )
        }
    ],
});
const DepotModel = mongoose.model('Depot', DepotModelSchema);
export default DepotModel;