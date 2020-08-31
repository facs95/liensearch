import React, { useState, useContext } from 'react';
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits, RefinementList, Configure } from "react-instantsearch-dom";
import { UserContext } from '../context/UserContext';

const searchClient = algoliasearch(
    "1AVZX9L93I",
    "68be777ac13a6002caf326d9bcfbf90a"
);

export const SearchAlgolia = () => {
    const [data, setData] = useState();

    const user = useContext(UserContext);
    
    return (
        <InstantSearch searchClient={searchClient} indexName="orders">
            <SearchBox />
            <Hits />
            <Configure filters={user?.admin ? undefined : `orgId:${user?.orgId}`} />
        </InstantSearch>
    );
};
