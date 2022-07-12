import express from "express"
import multer from "multer"
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'

const app=express()

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Customer API",
      description: "Customer API Information",
      contact: {
        name: "Amazing Developer"
      },
      servers: ["http://localhost:5000"]
    }
  },
  // ['.routes/*.js']
  apis: ["index.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(express.json())
app.use(express.urlencoded({extended:false}))



const multarStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public");
    },
    filename:(req,file,cb)=>{
        const ext=file.mimetype.split("/")[1]
        cb(null,`/admin-${file.fieldname}-${Date.now()}.${ext}`)
    }
})

// Multer Filter
const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1]==="jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Not a image File!!"), false);
    }
  };

const upload=multer({
    storage:multarStorage,
    fileFilter: multerFilter,
})


app.post('/upload',upload.array('image',10),async (req,res)=>{
    res.json("file uploaded")
})

app.listen(5000,(req,res)=>{
  console.log("Server is running");
})