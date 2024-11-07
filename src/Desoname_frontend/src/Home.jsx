import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRestActor } from "@bundly/ic-react";
import { AuthButton } from '@bundly/ic-react';

export const Home = () => {
    useEffect(() => {
        getUsers()
    }, [])

    const bnd = useRestActor("backend");
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            const res = await bnd.get("/users");
            console.log(res.data)
            setUsers(res.data)
        } catch (error) {
            console.log("Error", error)
        }
    }
    return (
        <>
            <div>Home</div>
            {
               <center><AuthButton> </AuthButton></center>
            }
        </>
    )
}