const fs = require("fs")
const express = require('express');

const app = express();
const PORT = 8000;

//middleware untuk membaca json dari req body ke kita
app.use(express.json())


//read file json (stringify binary, parse semua)
const customers = JSON.parse(
    fs.readFileSync(`${__dirname}/data/dummy.json`)
)

const defaultRouter = (req, res , next) => {
    res.send("<h1>HALLO FSW 1</h1>")
    
}
const getAllCustomersData = (req, res , next) => {

    res.status(200).json({
        status : "success",
        totalData: customers.length, 
        data : {
            customers,
        },
    })
}

const getCustomersID = (req, res , next) => {
    // console.log(req.params)
    // console.log(req.params.id)
    const id = req.params.id
    
    //menggunakan array method untuk membantu menentukan data
    const customer = customers.find((cust) => cust._id === id)

    console.log(customer)

    res.status(200).json({
        status : "success",
        //totalData: customers, 
        data : {
            customer,
        },
    })
}
const updateDataCustomer = (req, res)=>{
    const id = req.params.id
    // if(id )
    //melaukan pencariran daata sesuai parameter
    const customer = customers.find(cust => cust._id === id)
    const customerIndex = customers.findIndex(cust => cust._id === id) 

    //ada gak dataen
    if(!customer){
        return res.status(404).json({
            status: "fail",
            message: `customer dg ID : ${id} kosong`,
        })
    }

    //kalo ada update datanya dr user
    //object assogn menggaubungkan objdect or spread operator
    customers[customerIndex] = {...customers[customerIndex], ...req.body}

    //melaukan update di document JSONYA
    fs.writeFile(
        `${__dirname}/data/dummy.json`, 
        JSON.stringify(customers), 
        err =>{
        res.status(200).json({
            status: "success",
            message: "berhasil",
            data: {
                customer: customer[customerIndex],
                customer,
            },
        })
    })
}

const removeData = (req, res) => {
    const id = req.params.id;

    // Melakukan pencarian data sesuai parameter
    const customer = customers.find(cust => cust._id === id)
    const customerIndex = customers.findIndex(cust => cust._id === id);

    // Jika data tidak ditemukan
    if (customerIndex === -1) {
        return res.status(404).json({
            status: "fail",
            message: `customer dg ID : ${id} kosong`,
        });
    }

    // Menghapus data pelanggan dari array
    //kalo ada deletee datanya dr user
    //object assogn menggaubungkan objdect or spread operator
    //customers[customerIndex] = {...customers[customerIndex], ...req.body}
    customers.splice(customerIndex, 1);

    // Melakukan update di file JSON
    fs.writeFile(
        `${__dirname}/data/dummy.json`,
        JSON.stringify(customers),
        err => {
            // Jika berhasil, kirim respons berhasil
            res.status(200).json({
                status: "success",
                message: "Data customer berhasil dihapus",
            });
        }
    );
}

const createCustomer = (req, res) => {
    console.log(req.body)

    const newCustomers = req.body

    customers.push(newCustomers)
    fs.writeFile(`${__dirname}/data/dummy.json`, JSON.stringify(customers), err => {
        res.status(201).json({
            status: 'succes',
            data: {
                customers: newCustomers,
            },
        })
    })
}


//loca;host : 8000 postman
// app.get('/', defaultRouter);
// //status sukses
// //ur; api/v1/customers mendapatkan data
// app.get('/api/v1/customers', getAllCustomersData);
// // api utuk get by id
// app.get('/api/v1/customers/:id', getCustomersID);
// //Api update date
// app.patch('/api/v1/customers/:id', updateDataCustomer)
// //remove
// app.delete('/api/v1/customers/:id', removeData);
// //create  data baru newdata
// app.post('/api/v1/customers', createCustomer);

app.route('/api/v1/customers').get(getAllCustomersData).post(createCustomer)

app
    .route('/api/v1/customers/:id')
    .get(getCustomersID)
    .patch(updateDataCustomer)
    .delete(removeData)

    
//jalan port
app.listen(PORT, () => {
    console.log(`APP RUNNING ON PORT : ${PORT}`);
})


// app.listen(PORT, () => {
//     console.log('APP running on port : ' + PORT);
// });
