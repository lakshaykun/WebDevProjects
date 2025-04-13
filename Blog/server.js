const express = require("express");
const PORT = 3000;
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("./models/user");
const secret = "shhhhh";
const upload = require("./config/multerConfig");
const path = require("path");

app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let isLoggedIn = (req, res, next) => {
    if (req.cookies.token === "") res.redirect("/login");
    else {
        let data = jwt.verify(req.cookies.token, secret);
        req.user = data;
        next();
    }
}

// Routes

app.get("/", (req, res) => {
    res.render('index');
})

app.get("/profile", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email}).populate("posts");
    res.render("profile", {user});
})

app.get("/profile/upload", isLoggedIn, (req, res) => {
    res.render("uploadProfile");
})

app.post("/uploadProfile", isLoggedIn, upload.single("image"), async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    user.profilePic = req.file.filename;
    await user.save();
    res.redirect("/profile");
})

app.get("/edit/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id}).populate("user");
    res.render("edit", {post});
})

app.post("/update/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndUpdate({_id: req.params.id}, {content: req.body.content});
    res.redirect("/profile");
})

app.get("/like/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id}).populate("user");
    let temp = post.likes.indexOf(req.user.userid);
    if (temp === -1){
        post.likes.push(req.user.userid);
    } else {
        post.likes.splice(temp, 1);
    }

    await post.save();
    res.redirect("/profile");
})

app.post("/post", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    let post = await postModel.create({
        user: user._id,
        content: req.body.content
    });
    
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
})


app.post("/register", async (req, res) => {
    let {username, name, age, email, password} = req.body;
    let user = await userModel.findOne({email});
    if (user) return res.status(500).send("User already registered!");

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err,hash) => {
            let user = await userModel.create({
                username, name, email, age, password: hash
            })

            let token = jwt.sign({email: email, userid: user._id}, secret);
            res.cookie("token", token);
            res.redirect("/profile");
        })
    })

})

app.get("/login", (req,res) => {
    res.render("login");
})

app.post("/login", async (req, res) => {
    let {email, password} = req.body;
    let user = await userModel.findOne({email});
    if (!user) return res.status(500).redirect("/login");

    bcrypt.compare(password, user.password, (err, result) => {
        if (result){
            let token = jwt.sign({email: email, userid: user._id}, secret);
            res.cookie("token", token);
            res.redirect("/profile");
        }
        else res.redirect('/login');
    })

})

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login");
})


app.listen(PORT, () => {
    console.log(`server is running on - http://localhost:${PORT}/`);
});