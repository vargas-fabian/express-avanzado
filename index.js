const express= require('express');
const res = require('express/lib/response');
const { format } = require('express/lib/response');
const app = express();

class Producto{
    title;
    price;
    thumbnail;
    constructor(title, price, thumbnail){
        this.title = title;
        this.price = price;
        this.thumbnail =thumbnail;
    } 
}
class ProductoConId {
    id;
    producto;
    constructor(id, producto){
        this.id = id;
        this.producto = producto;
    }
}
class Contenedor{
    idGlobal;
    lista;
    constructor(){
        this.idGlobal = 1;
        this.lista = []
    }
    add(producto){
        const productoConId = new ProductoConId(this.idGlobal, producto);
        this.lista.push(productoConId);
        this.idGlobal = this.idGlobal + 1;
    }
    getAll(){
        return this.lista;
    }
    getById(id){

        for(var i=0; i< this.lista.length ; i++){
            
            const productoConId = this.lista[i];
            console.log(productoConId)
            if(id===productoConId.id){
                return productoConId.producto
            }
        }
        return undefined;
    }
    postProduct(product){
        this.add(product);
        const ultimoElemento = this.lista.length -1
        return this.lista[ultimoElemento];
    }
    putProduct(id,producto){
        for(var i=0; i< this.lista.length; i++){
            const productoConId = this.lista[i];
            if(id === productoConId.id){
                productoConId.producto=producto;
                return productoConId;
            }
        }
        return undefined;
    }
    deleteProduct(id){
        const nuevaLista = []
        for(var i=0; i<this.lista.length;i++){
            const productoConId = this.lista[i];
            if(id !== productoConId.id){
                nuevaLista.push(productoConId);
            }
        }
        console.log("actual", this.lista);
        console.log("nueva", nuevaLista);
        if (this.lista.length === nuevaLista.length) {
            return undefined;
        }
        this.lista = nuevaLista
        return nuevaLista;
    }
}

const micontenedor = new Contenedor();

const notFound = {
    error : "producto no encontrado"
};

app.use(express.json());

const router = express.Router();

router.get('/',(_ , res) => {
    res.send(micontenedor.getAll())
})

router.get('/:id',(req,res) => {
    const id = parseInt(req.params.id);
    const encontrado = micontenedor.getById(id);
    if(encontrado){
      res.send(encontrado);  
    }
    else{
        res.status(404).json(notFound)
    }
    

})
router.post('/',(req , res) => {
    const productoRecibido = req.body;
    res.send(micontenedor.postProduct(productoRecibido))
    console.log(micontenedor.getAll())
})
router.put('/:id',(req, res) => {
    const id = parseInt(req.params.id)
    const nuevoProducto = req.body;
    const actualizado = micontenedor.putProduct(id , nuevoProducto);
    if(actualizado){
      res.send(actualizado);  
    }
    else{
        res.status(404).json(notFound)
    }
})
router.delete('/:id',(req , res)=>{
    const id = parseInt(req.params.id);
    const eliminado =micontenedor.deleteProduct(id);
    if(eliminado){
        res.send(eliminado)    
    } 
    else{
        res.status(404).json(notFound)
    }
});

app.use('/api/productos', router);

const server = app.listen(8080, () =>{
    // Datos de prueba
    micontenedor.add(new Producto("auricular",5,"url1"));
    micontenedor.add(new Producto("teclado",56,"url2"));
    micontenedor.add(new Producto("mouse",64,"url3"));
    console.log("servidor http en el puerto 8080");
});

server.on('error', (err) => {
    console.log("Se ha producido un error,", err.message);
});
