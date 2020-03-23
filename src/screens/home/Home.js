import React, { Component } from 'react';
import "./Home.css"
import Header from "../../common/header/Header.js";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons'

class Home extends Component {

    constructor() {
        super();
        this.state = {
            restaurants: []
        }
    }

    componentWillMount() {
        let that = this;
        let data = null;
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(JSON.parse(this.responseText));
                that.setState({ restaurants: JSON.parse(this.responseText).restaurants });
            }
        })

        xhr.open("GET", this.props.baseUrl+"restaurant");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send(data);
    }

    restaurantClickHandler = (restaurantId) => {
        this.props.history.push('/details/'+restaurantId);
    }

    render() {
        let restaurantList = this.state.restaurants;
        console.log(this.state.restaurants)
        return (
            <div>
                <Header baseUrl={this.props.baseUrl} />
                <div className="cardContainer">
                    {restaurantList.map(restaurant => (
                        <Card key={restaurant.id} id={restaurant.id} className="restaurantCard" onClick={() => this.restaurantClickHandler(restaurant.id)}>
                            <CardActionArea>
                                <CardMedia
                                    className="restaurantImage"
                                    image={restaurant.photo_URL} />
                                <div className="restaurantName">
                                    {restaurant.restaurant_name}
                                </div>
                                <div className="restaurantCategories">
                                    {restaurant.categories}
                                </div>
                                <div className="restaurantDetails">
                                    <div className="restaurantRating">
                                        <FontAwesomeIcon icon={faStar} />
                                        <span> {restaurant.customer_rating}</span>
                                        <span> ({restaurant.number_customers_rated})</span>
                                    </div>
                                    <div className="restaurantPrice">
                                        <FontAwesomeIcon icon={faRupeeSign} />
                                        <span> {restaurant.average_price} for two</span>
                                    </div>
                                </div>
                            </CardActionArea>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }
}

export default Home;