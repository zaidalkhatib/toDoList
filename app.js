const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose")
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));



mongoose.connect("mongodb+srv://admin-Zaid:Zaedzaed12@todolistdatabase-vy9pw.mongodb.net/toDoListDB", { useNewUrlParser: true, useUnifiedTopology: true });
const ItemSchema = {
    name: String
};

const Item = mongoose.model("item", ItemSchema);

// const itemOne = new Item({ name: "open to do list" });
// const itemTwo = new Item({ name: "click on the + sign" });
// const itemThree = new Item({ name: "cross the note" });
// const arrayItems = [itemOne, itemTwo, itemThree];
// Item.insertMany(arrayItems, function(err) {
//     if (err) {
//         console.log("err");
//     } else {
//         console.log("item insrted ");
//     }
// })
const itemOne = new Item({ name: "Hello" });
const arrayItems = [itemOne];

const customSchema = { name: String, arrayItem: [ItemSchema] };
const CustomList = mongoose.model("customList", customSchema);


app.get("/", function(req, res) {

    Item.find({}, function(err, defaultItems) {
        if (defaultItems.length === 0) {
            Item.insertMany(arrayItems, function(err) {
                if (err) {
                    console.log("err");
                } else {
                    console.log("item insrted ");
                }
            })
            res.redirect("/");
        } else {
            res.render("todolist", { listTitle: "today", newListItems: defaultItems })

        }

    })
})

app.get('/:tagId', function(req, res) {


    const customParameter = req.params.tagId;
    CustomList.findOne({ name: customParameter }, function(err, foundName) {


        if (!err) {
            if (!foundName) {
                const newList = new CustomList({ name: customParameter, arrayItem: arrayItems });
                newList.save();
                res.redirect("/" + customParameter);
            } else {
                res.render("todolist", { listTitle: foundName.name, newListItems: foundName.arrayItem });

            }
        }

    })

});



app.post("/", function(req, res) {

    const newItem = req.body.item;
    const listName = req.body.list;
    const item = new Item({ name: newItem });
    if (listName === "today") {
        item.save();
        res.redirect("/")
    } else {
        CustomList.findOne({ name: listName }, function(err, foundList) {
            if (!err) {
                foundList.arrayItem.push(item);
                foundList.save();
                res.redirect("/" + listName);
            }
        })
    }

})

app.post("/delete", function(req, res) {
    const checkboxToDelete = req.body.checkbox;
    Item.findByIdAndDelete(checkboxToDelete, function(err) {
        if (err) {
            console.log("err");
        } else {
            console.log("delted successfully");
            res.redirect('back');
        }

    });
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function(req, res) {
    console.log("we are live on port 3000");
})