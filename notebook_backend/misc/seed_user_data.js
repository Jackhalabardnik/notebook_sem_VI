require('dotenv').config()
const connection = require('../db')

const random_words = require('random-words');

connection()

const {User} = require("../models/user");
const {Category} = require("../models/category");
const {Notebook} = require("../models/notebook");
const {Note} = require("../models/note");

const generate_name = () => {
    return random_words({
        exactly: 1, formatter: (word, index) => {
            if (word.length < 3) {
                word += word;
            }
            return word.slice(0, 1).toUpperCase().concat(word.slice(1));
        }
    })[0];
}

const generate_message = () => {

    let message = random_words({
        min: 1, max: 50, join: ' '});
    return message.slice(0, 1).toUpperCase().concat(message.slice(1));;
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed_notes_for_user(user) {
    const existing_notes = await Note.find({user: user._id});
    if (existing_notes.length > 0) {
        return;
    }

    const notes = [];

    const categories = await Category.find({user: user._id});

    for (let i = 0; i < categories.length; i++) {
        const notebooks = await Notebook.find({user: user._id, category: categories[i]._id});
        for (let j = 0; j < notebooks.length; j++) {
            let number = Math.floor(Math.random() * 25) + 1
            for (let k = 0; k < number; k++) {
                let is_updated = Math.random() < 0.5;
                let random_created_at = randomDate(new Date(2022, 4, 1), new Date());
                let random_updated_at = is_updated ? randomDate(random_created_at, new Date()) : null;
                notes.push({
                    user: user._id,
                    category: categories[i]._id,
                    notebook: notebooks[j]._id,
                    text: generate_message(),
                    createdAt: random_created_at,
                    updatedAt: random_updated_at
                });
            }
        }
    }

    await Note.insertMany(notes);

}

async function seed_notebooks_for_user(user) {
    const existing_notebooks = await Notebook.find({user: user._id})

    if (existing_notebooks.length > 0) {
        return
    }

    let notebooks = []

    const categories = await Category.find({user: user._id})

    for (let i = 0; i < categories.length; i++) {
        let number = Math.floor(Math.random() * 6) + 1
        for (let j = 0; j < number; j++) {
            notebooks.push({
                user: user._id,
                category: categories[i]._id,
                name: generate_name(),
            })
        }
    }

    await Notebook.insertMany(notebooks).catch(err => console.log(err))

}

async function seed_categories_for_user(user) {
    const existing_categories = await Category.find({user: user._id});

    if (existing_categories.length > 0) {
        return;
    }

    let categories = []

    let number = Math.floor(Math.random() * 10) + 1

    for (let i = 0; i < number; i++) {
        categories.push({
            user: user._id,
            name: generate_name(),
        })
    }

    await Category.insertMany(categories).catch(err => {
        console.log(err)
    })
}

async function add_empty_things(user) {
    const existing_categories = await Category.find({user: user._id});
    await Notebook.insertMany([{
        user: user._id,
        category: existing_categories[0]._id,
        name: 'Empty Notebook'
    }]).catch(err => console.log(err))
    await Category.insertMany([{
        user: user._id,
        name: 'Empty Category'
    }]).catch(err => console.log(err))
}

async function seedUsers() {
    const user = await User.find({});
    for (let i = 0; i < user.length; i++) {
        if(user[i].username === 'empty') {
            continue;
        }
        await seed_categories_for_user(user[i])
        await seed_notebooks_for_user(user[i])
        await seed_notes_for_user(user[i])
        await add_empty_things(user[i])
    }
}

const drop_data_without_users_and_seed_them = async () => {
    await Category.deleteMany({})
    await Note.deleteMany({})
    await Notebook.deleteMany({})
    seedUsers().then(() => {
        console.log("Seeding complete");
    }).catch((err) => {
        console.log(err);
    });
};

module.exports = drop_data_without_users_and_seed_them;