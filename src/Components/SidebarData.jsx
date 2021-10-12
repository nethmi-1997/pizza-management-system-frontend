import React from 'react';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import LocalPizzaIcon from '@material-ui/icons/LocalPizza';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PersonIcon from '@material-ui/icons/Person';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';

export const SidebarData = [
    {
        title: "Users",
        icon: <PeopleAltIcon />,
        path: "/users",
        role: ["ROLE_ADMIN"]
    },
    {
        title: "Crusts",
        icon: <LocalPizzaIcon />,
        path: "/crusts",
        role: ["ROLE_ADMIN", "ROLE_MANAGER"]
    },
    {
        title: "Toppings",
        icon: <LocalPizzaIcon />,
        path: "/toppings",
        role: ["ROLE_ADMIN", "ROLE_MANAGER"]
    },
    {
        title: "Orders",
        icon: <AttachMoneyIcon />,
        path: "/orders",
        role: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_CASHIER"]
    },
    {
        title: "Delivery",
        icon: <DirectionsBikeIcon />,
        path: "/delivery",
        role: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_DELIVERY"]
    },
    {
        title: "Reports",
        icon: <ReceiptIcon />,
        path: "",
        iconClosed: <ExpandMoreIcon />,
        iconOpen: <ExpandLessIcon />,
        role: ["ROLE_ADMIN"],
        subNav: [
            {
                title: "Users",
                icon: <PeopleAltIcon />,
                path: "/reports/users"
            },
            {
                title: "Crusts",
                icon: <LocalPizzaIcon />,
                path: "/reports/crusts"
            },
            {
                title: "Toppings",
                icon: <LocalPizzaIcon />,
                path: "/reports/toppings"
            },
            {
                title: "Orders",
                icon: <AttachMoneyIcon />,
                path: "/reports/orders"
            },
            {
                title: "Delivery",
                icon: <DirectionsBikeIcon />,
                path: "/reports/delivery",
            }
        ]
    },
    {
        title: "Profile",
        icon: <PersonIcon />,
        path: "/profile",
        role: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_CASHIER", "ROLE_DELIVERY"]
    }
]