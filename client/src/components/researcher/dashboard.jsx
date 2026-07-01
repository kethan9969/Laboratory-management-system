import { Card, CardContent, Stack, Typography } from "@mui/material";
import axios from "axios";
import React from "react";

export default function RDashboard() {
	const [count, setCount] = React.useState([]);

	React.useEffect(() => {
		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/auth/count")
			.then((res) => {
				setCount(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<Stack direction='row' gap={2}>
			<Card sx={{ width: 120 }}>
				<CardContent>
					<Typography variant='body1' sx={{ fontWeight: "bold" }}>
						Categories
					</Typography>
					<Typography variant='h3'>{count.categories}</Typography>
				</CardContent>
			</Card>

			<Card sx={{ width: 120 }}>
				<CardContent>
					<Typography variant='body1' sx={{ fontWeight: "bold" }}>
						Items
					</Typography>
					<Typography variant='h3'>{count.items}</Typography>
				</CardContent>
			</Card>
		</Stack>
	);
}
