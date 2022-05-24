require('dotenv').config()
console.log(process.env.DB)
const connection = require('../db')

connection()

const {User} = require("../models/user");
const {Category} = require("../models/category");

async function seed_categories_for_user(user) {
    const categories = [
        {
            "name": "Work",
            "user": user._id
        },
        {
            "name": "Home",
            "user": user._id
        },
        {
            "name": "Personal",
            "user": user._id
        },
        {
            "name": "Shopping",
            "user": user._id
        },
        {
            "name": "Travel",
            "user": user._id
        },
        {
            "name": "Other",
            "user": user._id
        }
    ]

    const existing_categories = await Category.find({user: user._id});

    if (existing_categories.length > 0) {
        console.log("Categories already exist for user: " + user.username);
        return;
    }

    await Category.insertMany(categories).catch(err => {
        console.log(err)
    })
}

async function seedUsers() {
    const user = await User.find({});
    for(let i = 0; i < user.length; i++) {
        await seed_categories_for_user(user[i])
    }
}

seedUsers().then(() => {
    console.log("Seeding complete");
    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(1);
});
