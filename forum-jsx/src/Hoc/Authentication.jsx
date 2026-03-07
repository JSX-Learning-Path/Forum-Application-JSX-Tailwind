
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase-config";
// new code added for authentication
/**
 * Higher-order component for authentication.
 * 
 * @param prop - The component's props.
 * @returns The authenticated component.
 */
export default function Authentication(prop) {
    const [user, loading] = useAuthState(auth);

    if (loading) return null;

    return user ? <>{prop.children}</> : null;
}
