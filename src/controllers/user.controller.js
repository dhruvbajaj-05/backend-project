import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js";
import {User} from "../models/user.models.js";
import {ApiResponse} from "../utils/ApiResponses.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

const registerUser = asyncHandler( async (req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username,email
    // check for images,check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName, email, username,password} = req.body
    console.log("email",email);

    //Either you write this way for every character or the one below this
    // if(fullName ===  ""){
    //     throw new ApiError(400, "fullanme is required")
    // }

    //Getting user details and throwing errors if not given
    if(
        [fullName, email, username, password].some((field)=>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    //Checking for validation
    const existedUser = User.findOne({
        //this symbol is to check both stuff simultaneously from the database
        $or:[{username}, {email}]
    })
    if(existedUser)
    {
        throw new ApiError(409, "User with email and username already exists");
    }

    //Check if you have the path for the files uploaded on multer for avatar and coverImage

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    //this ? is like only if, then do

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    //upload these files to the cloudinary to make them to a url
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //We definitely require an avatar if not a coverImage
    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    //creating the user and adding it to the data base
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",//cover image may or may not be there
        email,
        password,
        username: username.toLowerCase()
    })

    //checking if the user is added to the database if yes then remove the password and refreshtoken
    const createdUser = await User.findById(user._id).select(
        "-password -refreshtoken"//this is the syntax with a space to exclude whatever is given in the string
    )

    if(!createdUser)
    {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    )
} )


export {registerUser}