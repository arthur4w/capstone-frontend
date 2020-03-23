import React, {Component} from 'react';
import './Details.css';
import Header from "../../common/header/Header.js";
import { Typography, Divider, List } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import ListItem from '@material-ui/core/ListItem';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';


class Details extends Component {

    constructor() {
        super();

        this.state= {
            restaurantDetail: {
                address: {},
                categories: []
            },
            cartItems: []            
        }
    }

    addItemHandler = (name, price, type, id) => {

        console.log(name, price, type, id);

        let itemsAdded = [];
        let isItemAdded = false;

        if(this.state.cartItems.length !== 0) {
        
        {this.state.cartItems.forEach((itemobj, index) => {
            if(itemobj.itemid === id ) {

                let itemObject = {
                    itemid: id,
                    itemname: name,
                    itemtype: type,
                    itemprice: price,
                    quantity: itemobj.quantity + 1
                }

                itemsAdded.push(itemObject);
                isItemAdded = true;

            } else {

                let itemObject = {
                    itemid: itemobj.itemid,
                    itemname: itemobj.itemname,
                    itemtype: itemobj.itemtype,
                    itemprice: itemobj.itemprice,
                    quantity: itemobj.quantity
                }

                itemsAdded.push(itemObject)

            } 

        })}
       } else {
           let itemObject = {
            itemid: id,
            itemname: name,
            itemtype: type,
            itemprice: price,
            quantity: 1
           }

           itemsAdded.push(itemObject)
           isItemAdded = true;     
        }

        if(!isItemAdded) {

            let itemObject = {
                itemid: id,
                itemname: name,
                itemtype: type,
                itemprice: price,
                quantity: 1
               }
               itemsAdded.push(itemObject)
        }
        
        console.log(itemsAdded);
        this.setState({cartItems: itemsAdded});        
    }    

    componentWillMount() {
    
        let that = this;
        let restaurantData = null;
        let xhrRestaurant = new XMLHttpRequest();
        xhrRestaurant.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {  

                console.log(JSON.parse(this.responseText))          
                that.setState({restaurantDetail: JSON.parse(this.responseText)});                
            }
        })

        xhrRestaurant.open("GET", this.props.baseUrl+"restaurant/"+this.props.match.params.id);
        xhrRestaurant.setRequestHeader("Cache-Control", "no-cache");
        xhrRestaurant.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhrRestaurant.send(restaurantData);
    }


    increaseCartItem = (quantity, id) => {

        let updatedCart = []
        {this.state.cartItems.forEach((item, index) => {
            if(item.itemid == id) {
                item.quantity = quantity + 1;
                updatedCart.push(item)    
            } else {
                updatedCart.push(item)
            }
        })}
        this.setState({cartItems: updatedCart})
    }

    decreaseCartItem = (quantity, id) => {

        let updatedCart = []
        {this.state.cartItems.forEach((item, index) => {
            if(item.itemid == id) {
                if(item.quantity > 1) {
                    item.quantity = quantity - 1;
                    updatedCart.push(item)
                }
                    
            } else {
                updatedCart.push(item)
            }
        })}
        this.setState({cartItems: updatedCart})
    }
    
    render() {
        let restaurant = this.state.restaurantDetail;
        let categoryArray = [];
        let itemcount = 0;
        let cartTotal = 0;
        return (

            <div>
                <Header />
                <div className="restaurantDiv">

                    <div className="leftDetails">
                    <img src={restaurant.photo_URL} alt={restaurant.restaurant_name} height className="restImg" />
                    </div>

                    <div className="middleDetails">
                        <br /><br /><br />
                        <div>
                            <Typography variant="h3">{restaurant.restaurant_name}</Typography>
                        </div>

                        <div>
                            <Typography variant="h6">{restaurant.address.locality}, {restaurant.address.city}</Typography>
                        </div> <br />
                         
                        <div>
                            {
                                restaurant.categories.forEach((category, index)=>{
                                categoryArray.push(category.category_name)   
                                })                                
                            }                            
                            <Typography>{categoryArray.join(',')}</Typography>                               
                        </div>

                        <div>
                            <Typography>
                               <span> 
                               <FontAwesomeIcon icon={faStar} />: 
                                    { restaurant.customer_rating}
                                </span> 
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="caption"className="drakGray">AVERAGE RATING BY</Typography>   
                            <br/>
                            <Typography variant="caption"className="drakGray">{restaurant.number_customers_rated} CUSTOMERS</Typography>
                        </div>

                    </div>

                    <div className="rightDetails">
                        <br/><br/><br/><br/><br/><br/><br/><br/><br/>
                            <div>
                                <Typography>
                                    <FontAwesomeIcon icon={faRupeeSign} /> { restaurant.average_price}
                                </Typography>
                                <Typography variant="caption" className="drakGray">AVERAGE COST FOR</Typography>
                                <br/>
                                <Typography variant="caption"className="drakGray">TWO PEOPLE</Typography>                                  
                                
                            </div>
                    </div>
                </div>

                <div className="itemandCart">
                            
                    <div className="itemsDiv">
                        {restaurant.categories.map(category => ( 
                            
                            <List key={category.id}>
                                    <Typography variant="h4">{category.category_name}</Typography>
                                    <Divider />
                                    {category.item_list.map(item => (
                                        <ListItem key={item.id}>
                                            {item.item_type === "NON_VEG" ? <FontAwesomeIcon className="red itemType" icon={faCircle}/>:
                                            <FontAwesomeIcon className="green itemType" icon={faCircle}/>}

                                            <Typography variant="h6">
                                                <span className="itemName">{item.item_name}</span>
                                            </Typography>

                                            <Typography>
                                                <span className="itemPrice">
                                                <FontAwesomeIcon icon={faRupeeSign} />
                                                {item.price}
                                                </span>
                                                
                                            </Typography>

                                            <Typography>
                                                <span className="addIcon">
                                                    <AddIcon onClick={() => this.addItemHandler(item.item_name, item.price, item.item_type, item.id)} />
                                                </span>
                                            </Typography>

                                        
                                            
                                        </ListItem>
                                    ))}
                            </List>
                        ))}                    
                    </div>
                                        
                    <div className="cart">
                          <br /><br /><br /><br /><br /><br />              
                        <Card className="checkoutcart">
                            <div className="shoppingCart">
                                <br />
                                    
                                <ShoppingCartIcon className="shoppingIcon" />
                                <Typography variant="h5" display="inline">My Cart</Typography>
                                <br/>
                                <List>
                                        
                                    {this.state.cartItems.length === 0 ? "" : this.state.cartItems.map(item => (
                                        <ListItem>

                                            {item.itemtype === "NON_VEG" ? <FontAwesomeIcon className="red cartItemType" icon={faCircle}/>:
                                        <FontAwesomeIcon className="green cartItemType" icon={faCircle}/>}

                                        <Typography>
                                            <span className="cartItem">{item.itemname}</span>
                                        </Typography>

                                        <RemoveIcon className="removeIcon" onClick={() => this.decreaseCartItem(item.quantity, item.itemid)} />
                                            <span className="itemQuantity">{item.quantity}</span>
                                        <AddIcon className="addIconCart" onClick={() => this.increaseCartItem(item.quantity, item.itemid)} />

                                        <FontAwesomeIcon icon={faRupeeSign} className="cartItemCurrency" />
                                        <span className="itemTotalPrice">{item.itemprice * item.quantity}</span>

                                             
                                        </ListItem>
                                    ))
                                            
                                    }

                                </List>

                                <br/><br/>   
                                <span className="totalAmount">TOTAL AMOUNT</span>
                                <FontAwesomeIcon icon={faRupeeSign} />                                    
                                { this.state.cartItems.length !==0 &&
                                this.state.cartItems.forEach((item, index) => {
                                   cartTotal = (item.itemprice * item.quantity) + cartTotal; 
                                })
                                }
                                <span>{cartTotal}</span>                                     
                                <br /> <br />

                                <Button variant="contained" color="primary" fullWidth="true">
                                    CHECKOUT
                                </Button>  
                                <br /> <br />                                        
                            </div>
                        </Card>
                    </div>
                </div>                         
            </div>
        )
    }
}

export default Details;