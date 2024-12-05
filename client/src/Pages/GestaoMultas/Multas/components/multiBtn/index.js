import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		"& > *": {
			margin: theme.spacing(1),
		},
	},
	icon: {
		marginLeft: "10px",
	},
}));

export default function MultiButton({ buttons }) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<ButtonGroup color="primary" aria-label="outlined secondary button group">
				{buttons.map((button, index) => (
					<Button key={index} onClick={button.onClick}>
						{button.label}
						<div className={classes.icon}>{button.icon}</div>
					</Button>
				))}
			</ButtonGroup>
		</div>
	);
}
