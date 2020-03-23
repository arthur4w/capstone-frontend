import React, {Component} from 'react';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import './Header.css';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}

const TabContainer = (props) => {
    return (
        <Typography component="div" style={{padding: 0, textAlign: "center"}}>
            {props.children}
        </Typography>
    );
}




class Header extends Component {

    constructor() {
        super();
        this.state = {
            restaurantList: [{}],
            modalIsOpen: false,
            value: 0,
            contactnumber: "",
            contactnumberRequired: "dispNone",
            isInvalidNumber: false,
            password: "",
            passwordRequired: "dispNone",
            loggedIn: false,
            openPopupMsg: false,
            firstname: "",
            firstnameRequired: "dispNone",
            lastname: "",
            lastnameRequired: "dispNone",
            email: "",
            emailRequired: "dispNone",
            isInvalidPass: false,
            isInvalidEmail: false,
            registrationSuccess: false,
            loginMessage: "dispNone",
            registerMessage: "dispNone",
            loggedInUsername: "",
            showUserMenu: false,
            userMenuLoc: null
        }
    }

    searchMoviesHandler = (e) => {

        if(e.target.value !== "") {

        let that = this;
        let requestData = null;
        let searchMovies = new XMLHttpRequest();
        searchMovies.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
                console.log(JSON.parse(this.responseText));
                that.setState({restaurantList: JSON.parse(this.responseText).movies});
            }
        })

        searchMovies.open("GET", this.props.baseUrl+"restaurant/name/"+e.target.value);
        searchMovies.setRequestHeader("Cache-Control", "no-cache");
        searchMovies.setRequestHeader("Access-Control-Allow-Origin", "*");
        searchMovies.setRequestHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
        searchMovies.send(requestData);

    } 

    }

    openModalHandler = () => {
        this.setState({
            modalIsOpen: true,
            value: 0,
            contactnumber: "",
            contactnumberRequired: "dispNone",            
            password: "",
            passwordRequired: "dispNone",
            isInvalidNumber: false,
            openPopupMsg: false,
            firstname: "",
            firstnameRequired: "dispNone",
            lastname: "",
            lastnameRequired: "dispNone",
            email: "",
            emailRequired: "dispNone",
            isInvalidPass: false,
            isInvalidEmail: false,
            registrationSuccess: false,
            loginMessage: "dispNone",
            registerMessage: "dispNone"
            
        })
    }

    tabChangeHandler = (event, value) => {
        this.setState({value})
    }

    inputcontactnumberChangeHandler = (e) => {
        this.setState({contactnumber: e.target.value})
    }

    inputPasswordChangeHandler = (e) => {
        this.setState({password: e.target.value})
    }

    closeModalHandler = () => {
        this.setState({
            modalIsOpen: false
        })
    }

    loginClickHandler = () => {

        this.state.contactnumber === "" ? this.setState({contactnumberRequired: "dispBlock"}) :
        this.setState({contactnumberRequired: "dispNone"});
        this.state.password === "" ? this.setState({passwordRequired: "dispBlock"}) :
        this.setState({passwordRequired: "dispNone"});

        if(this.state.contactnumber !== "" && this.state.contactnumber.length !== 10) {
            this.setState({
                isInvalidNumber: true,
                contactnumberRequired: "dispBlock"
            })
        }

        if((this.state.contactnumber === "") || (this.state.password === "") || (this.state.isInvalidNumber === true)) {
            return;
        }


        //api call

        let that=this;

        let loginData =  null;
        let loginAuthHeader = new Buffer(this.state.contactnumber+':'+this.state.password).toString('base64');

        let xhrlogin = new XMLHttpRequest();
        xhrlogin.addEventListener("readystatechange", function() {

            if(this.readyState === 4) {
                
                console.log(JSON.parse(this.responseText));                
                sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
                sessionStorage.setItem("access-token", xhrlogin.getResponseHeader("access-token"));  
                let username = JSON.parse(this.responseText).first_name;              
                that.setState({
                    openPopupMsg: true,
                    loggedIn: true,
                    loginMessage: "dispBlock message",
                    loggedInUsername: username
                })
                that.closeModalHandler();

            }
        })

        xhrlogin.open("POST", "http://localhost:8080/api/customer/login");
        xhrlogin.setRequestHeader("authorization", "Basic "+loginAuthHeader);
        xhrlogin.setRequestHeader("Cache-Control", "no-cache");
        xhrlogin.send(loginData);

        //Login successful message

        


        
    }

    snackBarCloseHandler = () => {
       this.setState({openPopupMsg: false})     
    }

    firstnameChangeHandler = (e) => {
        this.setState({firstname: e.target.value})
    }

    lastnameChangeHandler = (e) => {
        this.setState({lastname: e.target.value})
    }

    emailChangeHandler = (e) => {
        this.setState({email: e.target.value})
    }



    registerClickHandler = () => {

        this.state.firstname === "" ? this.setState({firstnameRequired: "dispBlock"}) :
        this.setState({firstnameRequired: "dispNone"});
        this.state.lastname === "" ? this.setState({lastnameRequired: "dispBlock"}) :
        this.setState({lastnameRequired: "dispNone"});
        this.state.email === "" ? this.setState({emailRequired: "dispBlock"}) :
        this.setState({emailRequired: "dispNone"});

        this.state.password === "" ? this.setState({passwordRequired: "dispBlock"}) :
        this.setState({passwordRequired: "dispNone"});

        this.state.contactnumber === "" ? this.setState({contactnumberRequired: "dispBlock"}) :
        this.setState({contactnumberRequired: "dispNone"});
        

        if(this.state.contactnumber !== "" && /^\d{10}$/.test(this.state.contactnumber) === false) {
            
            this.setState({
                isInvalidNumber: true,
                contactnumberRequired: "dispBlock"
            })
        } else if(this.state.contactnumber !== "" && /^\d{10}$/.test(this.state.contactnumber) === true) {
            this.setState({
                isInvalidNumber: false,
                contactnumberRequired: "dispNone"
            })    
        }

        if(this.state.password !== "" && /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20})/.test(this.state.password) === false) {
            
            this.setState({
                isInvalidPass: true,
                passwordRequired: "dispBlock"                
            })
            
        } else if(this.state.password !== "" && /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20})/.test(this.state.password) === true) {
            this.setState({
                isInvalidPass: false,
                passwordRequired: "dispNone"                
            })

        }
        

        if(this.state.email !== "" && 
        /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm.test(this.state.email) === false) {

            this.setState({
                isInvalidEmail: true,
                emailRequired: "dispBlock"
            })

        } else if(this.state.email !== "" && 
        /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm.test(this.state.email) === true) {
            this.setState({
                isInvalidEmail: false,
                emailRequired: "dispNone"
            })

        }

        if((this.state.firstname === "") || (this.state.lastname === "") || (this.state.email === "")
        || (this.state.contactnumber === "") || (this.state.password === "") || (this.state.isInvalidEmail)
        || (this.state.isInvalidNumber) || (this.state.isInvalidPass)) {

            return;
        }

        //registration api call


        let that=this;
        let signupData = JSON.stringify({

            "contact_number": this.state.contactnumber,
            "email_address": this.state.email,
            "first_name": this.state.firstname,
            "last_name": this.state.lastname,
            "password": this.state.password
            
          })
        let xhrsignup = new XMLHttpRequest();
        xhrsignup.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
                console.log(JSON.parse(xhrsignup.responseText));
                that.setState({
                    registrationSuccess: true,
                    openPopupMsg: true,
                    registerMessage: "dispBlock message"
                });
                that.openModalHandler();
            }
        })

        xhrsignup.open("POST", this.props.baseUrl+"customer/signup");
        xhrsignup.setRequestHeader("Content-Type", "application/json");
        xhrsignup.setRequestHeader("Cache-Control", "no-cache");
        xhrsignup.send(signupData);



    }

    userMenuHandler = (e) => {
        this.setState({
            showUserMenu: true,
            userMenuLoc: e.currentTarget
        })
    }

    closeMenuHandler = () => {
        this.setState({showUserMenu: false})
        }

    logoutHandler = () => {
        sessionStorage.clear();
        this.setState({
            loggedIn: false,
            loggedInUsername: "",
            showUserMenu: false,
            userMenuLoc: null
        })
    }   
 

    render() {
        return(
            <div>
                <header className='header'>
                    <FastfoodIcon className="app-logo" fontSize="large" />
                    
                    <Input className="searchBar" color="primary" 
                    placeholder= "Search by Restautant Name"
                    rows= "50" size="large"
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon fontSize="large" htmlColor="white" />
                        </InputAdornment>
                        }                
                    onChange={this.searchMoviesHandler}                 
                    />

                    
                    {this.state.loggedIn ? 
                    <div className="accountIcon" onClick={this.userMenuHandler}>
                     <AccountCircleIcon color="action" fontSize="large"  /> 
                    <span className="loggedinUser">   {this.state.loggedInUsername}</span>  
                    </div> :    

                    <Button 
                    variant="contained"
                    color="default"
                    startIcon={<AccountCircleIcon />}
                    size="large"
                    onClick={this.openModalHandler}
                    >
                        Login
                    </Button> }

                    <Menu
                    id="simple-menu"
                    anchorEl={this.state.userMenuLoc}
                    keepMounted
                    open={this.state.showUserMenu}
                    onClose={this.closeMenuHandler}
                    >
                        <Link to={"/profile"}>
                        <MenuItem>Profile</MenuItem>
                        </Link>

                        <MenuItem onClick={this.logoutHandler}>Logout</MenuItem>
                        
                    </Menu>

                </header>

                <Modal ariaHideApp={false} isOpen={this.state.modalIsOpen} contentLabel="Login"
                onRequestClose={this.closeModalHandler} style={customStyles}>

                    <Tabs className="tabs" value={this.state.value} onChange={this.tabChangeHandler}>
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>

                    {this.state.value === 0 &&
                    <TabContainer>

                        <FormControl required>

                            <InputLabel htmlFor="contact">Contact No</InputLabel>
                            <Input id="contact" type="text" contactnumber={this.state.contactnumber} 
                                onChange={this.inputcontactnumberChangeHandler} />
                            <FormHelperText className={this.state.contactnumberRequired}>
                                {this.state.isInvalidNumber === true ? <span className="red">Invalid Contact</span>
                                : <span className="red">required</span> }                                     
                            </FormHelperText>  

                        </FormControl>
                        <br /><br />
                        <FormControl required>

                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input id="password" type="password" contactnumber={this.state.password} 
                                onChange={this.inputPasswordChangeHandler} />
                            <FormHelperText className={this.state.passwordRequired}>
                                    <span className="red">required</span>                               
                            </FormHelperText>    

                            <br /><br />
                            <Button variant="contained" color="primary" onClick={this.loginClickHandler}>
                                LOGIN
                            </Button>

                        </FormControl>

                    </TabContainer>

                    }

                    {this.state.value === 1 &&
                    
                    <TabContainer>

                            <FormControl required>
                                <InputLabel htmlFor="firstname">First Name</InputLabel>
                                <Input id="firstname" type="text" firstname={this.state.firstname}
                                 onChange={this.firstnameChangeHandler}/>
                                
                                <FormHelperText className={this.state.firstnameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>

                            </FormControl><br /><br />

                            <FormControl required>
                                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                <Input id="lastname" type="text" lastname={this.state.lastname}
                                onChange={this.lastnameChangeHandler} />
                                
                                <FormHelperText className={this.state.lastnameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>

                            </FormControl><br /><br />

                            <FormControl required>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" type="text" email={this.state.email}
                                onChange={this.emailChangeHandler} />
                                
                                <FormHelperText className={this.state.emailRequired}>
                                    
                                    {this.state.isInvalidEmail ? <span className="red">Invalid Email id!!</span>
                                    : <span className="red">required</span>}

                                </FormHelperText>

                            </FormControl><br /><br />

                            <FormControl required>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input id="password" type="password" password={this.state.password}
                                onChange={this.inputPasswordChangeHandler} />
                                
                                <FormHelperText className={this.state.passwordRequired}>

                                    {this.state.isInvalidPass ? <span className="red">Password must contain at least one capital letter, one small letter, one number, and one special character</span>:
                                     <span className="red">required</span>}
                                    
                                </FormHelperText>

                            </FormControl><br /><br />

                            <FormControl required>
                                <InputLabel htmlFor="contact">Contact</InputLabel>
                                <Input id="contact" type="text" contactnumber={this.state.contactnumber}
                                onChange={this.inputcontactnumberChangeHandler} />
                                
                                <FormHelperText className={this.state.contactnumberRequired}>

                                    {this.state.isInvalidNumber ? <span className="red">Contact No. must contain only numbers and must be 10 digits long</span>:
                                     <span className="red">required</span>}
                                    
                                </FormHelperText>

                            </FormControl><br /><br />

                            <Button variant="contained" color="primary" onClick={this.registerClickHandler}>
                                REGISTER
                            </Button>



                    </TabContainer>

                    }
                </Modal>


                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    autoHideDuration={5000}
                    className="snackbar"
                    open={this.state.openPopupMsg}
                    onClose={this.snackBarCloseHandler}
                    message={
                        <span id="client-snackbar">
                        <div className="confirm">
                            <div className={this.state.loginMessage}> 
                                Logged in successfully!!
                            </div>
                            <div className={this.state.registerMessage}>
                                Registered successfully, Please Login!!
                            </div>
                        </div>
                        </span>
                    }                    
                />
            </div>
        )
    }
}

export default Header;