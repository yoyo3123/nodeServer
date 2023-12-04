const sendfunc = () =>{
    let email = document.getElementById('userEmail').value
    let pass = document.getElementById('userPass').value

    fetch('/sendDetail',{
        headers:{'Accept': 'application/json', 'Content-Type':'application/json'},
        method:'post',
        body:JSON.stringify({email,pass})


    })

    .then(res=>res.text())
    
    .then((data) => {
        if (data != 'good') {
            alert(data)
        }else{
            location.href = 'http://localhost:3000/products';
            
            
        }
    })
    .catch((err)=>{
        console.log(err);
    })
}

const sendfetch = ()=>{
    let username = document.getElementById('username').value
    let email = document.getElementById('email').value
    let pass = document.getElementById('pass').value

    fetch('/signIn',{
        headers:{'Accept': 'application/json', 'Content-Type':'application/json'},
        method:'post',
        body:JSON.stringify({username,email,pass})


    })

    .then(res=>res.text())
    
    .then((data) => {
        if (data != 'good') {
            alert(data)
        }else{
            location.href = 'http://localhost:3000/';
            
            
        }
    })
    .catch((err)=>{
        console.log(err);
    })
    



}




    







