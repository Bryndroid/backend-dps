import app from "./app.js";
import "./events/index.js";
app.listen(app.get("port"),"0.0.0.0", ()=>{
    console.log("Aplicación desplegada en el puerto", app.get("port"));
});