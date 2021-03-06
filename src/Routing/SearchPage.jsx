import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchPage.css";

import ReactLoading from "react-loading";

import { useSearchParams, Navigate } from "react-router-dom";

import Product from "../Components/Products/Product/Product";

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams(
        window.location.search
    );
    let searchText = searchParams.get("query");
    if (searchText) {
        searchText = searchText.toLowerCase();
    }

    let [items, setItems] = useState(false);
    let [filteredItems, setFilterdItems] = useState("loading");

    useEffect(() => {
        axios
            .get(`https://api.escuelajs.co/api/v1/products/`)
            .then((response) => {
                setTimeout(() => {
                    setItems(response.data);
                }, 100)
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (items) {
            let filterd = items.filter((el) => {
                return String(el.title).toLowerCase().search(searchText) >= 0;
            });
            setFilterdItems(filterd);
        }
    }, [items]);

    return (
        <>
            <section
                className="search-items  row p-0 p-md-5 py-5 m-0  gap-4"

            >
                <h5 className="section-title">Search Results</h5>
                {filteredItems == "loading" ? (
                    <div className="w-100 h-100 mt-5  d-flex align-items-center justify-content-center">
                        <ReactLoading type={"spin"} color={"black"} width={80} />
                    </div>
                ) : filteredItems.length ? (
                    <div>
                        <div className="items">
                            {filteredItems.map((item) => {
                                return (
                                    <Product
                                        key={item.id}
                                        id={item.id}
                                        prodName={item.title}
                                        prodPrice={item.price}
                                        imageSrc={item.images[0]}
                                        imageAlt={item.title}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <h4 className="text-center mt-5 text-danger">No Products Found</h4>
                )}
            </section>
        </>
    );
}
