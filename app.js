const express = require ("express");
const jwt = require("jsonwebtoken");
const dbconnect = require("./config");
const ModelUser = require("./userModel");
const app = express();

const router = express.Router();
const JWT_SECRET = "your_jwt_secret"; 

const authenticateJWT = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; 
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); 
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); 
    }
};

router.post("/register", async (req, res) => {
    const body = req.body;
    const newUser = await ModelUser.create(body);
    
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await ModelUser.findOne({ email });

    if (user && user.password === password) { 
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.sendStatus(401); 
    }
});

router.get("/protected", authenticateJWT, (req, res) => {
    res.send("This is a protected route");
});

router.post("/",async (req, res)=>{
    const body = req.body;
    const respuesta = await ModelUser.create(body)
    res.send(respuesta)
})

router.get("/", async (req, res)=> {
    const respuesta = await ModelUser.find({})
    res.send(respuesta)
})
router.get("/:id", async (req, res)=> {
    const id = req.params.id;
    try {
        const respuesta = await ModelUser.findById(id);
        if (!respuesta) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.send(respuesta);
    } catch (error) {
        return res.status(400).send("ID inválido");
    }
})
router.put("/:id", async (req, res)=> {
    const body = req.body;
    const id = req.params.id;
    const respuesta = await ModelUser.findOneAndUpdate({_id: id}, body)
    res.send(respuesta)
})
router.delete("/:id", async (req, res)=> {
    const id = req.params.id;
    const respuesta = await ModelUser.deleteOne({_id: id })
    res.send(respuesta)
})

app.use(express.json())
app.use(router)
app.listen(3001)
console.log("Corriendo en el puerto 3001")

dbconnect();