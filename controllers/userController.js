import AppError from "../utils/error.util.js";
import User from "../models/userModel.js";

const register = async (req, res, next) => {
    const{name, email, password} = req.body;
    if(!name || !email || !password) {
        return next(new AppError('All field are required', 400))
    }

    const userExists = await User.findOne({email});
    if(userExists) {
        return next(new AppError('User already register', 400))
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Favatar&psig=AOvVaw2Xke-S6Gg6X9XEVouvQjtW&ust=1697472372166000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCNjTsL-3-IEDFQAAAAAdAAAAABAE'
        }
    });
};

const login = (req, res) => {

};

const logout = (req, res) => {

};

const getProfile = (req, res) => {

};

export {
    register,
    login,
    logout,
    getProfile
}