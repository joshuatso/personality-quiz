import React from 'react'
import {Button} from "@material-ui/core"
import {Link} from "react-router-dom"

export default function Home() {
    return (
        <div>
            <Link to="/login">
                <Button>Login</Button>
            </Link>
        </div>
    )
}
