import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import EmailIcon from '@mui/icons-material/EmailRounded';
import logo from '../assets/logo/logo_1_inverted_subtract_turboflakes_.svg';
import twitterSVG from '../assets/twitter_white.svg';
import githubSVG from '../assets/github_white.svg';

export default function Footer(props) {
	
	const handleTwitter = () => {
		window.open('https://twitter.com/turboflakes', '_blank')
	}
	
	const handleGithub = () => {
		window.open('https://github.com/turboflakes', '_blank')
	}

	const handleEmail = () => {
		window.location.href = "mailto:support@turboflakes.io"
	}

		return (
			<Box sx={{ marginTop: 10, bgcolor: 'background.secondary', padding: 'spacing.unit'}} >
				<Container>
					<Grid container sx={{ padding: `48px 0` }}>
						<Grid container item xs={12} sm={6}>
							<Link href="/" color="inherit" align="right" >
								<img src={logo} style={{ height: 64, marginBottom: 24 }} alt={"logo"}/>
							</Link>
						</Grid>
          	<Grid item xs={6} sm={3}>
							<Typography variant="h5" color="textSecondary" paragraph>
								General
							</Typography>
							<Typography color="textSecondary" gutterBottom>
								<Link href="https://www.turboflakes.io/#/about" underline="none" color="inherit">About us</Link>
							</Typography>
							{/* <Typography color="textSecondary" gutterBottom>
								<Link href="https://www.turboflakes.io/#/tools" underline="none" color="inherit">Tools</Link>
							</Typography> */}
							<Typography color="textSecondary" gutterBottom>
								<Link href="https://www.turboflakes.io/#/validators" underline="none" color="inherit">Validators</Link>
							</Typography>
							<Typography color="textSecondary" gutterBottom>
								<Link href="https://pools.turboflakes.io" underline="none" color="inherit">Nomination Pools</Link>
							</Typography>
						</Grid>
						<Grid item xs={6} sm={3}>
							<Typography variant="h5" color="textSecondary" paragraph>
								Networks
							</Typography>
							<Typography color="textSecondary" gutterBottom>
								<Link href="https://polkadot.network/" underline="none"  target="_blank" rel="noreferrer" color="inherit">Polkadot Network</Link>
							</Typography>
							<Typography color="textSecondary" gutterBottom>
								<Link href="https://kusama.network/" underline="none" target="_blank" rel="noreferrer" color="inherit">Kusama Network</Link>
							</Typography>
						</Grid>
					</Grid>
					<Box>
						<IconButton size="small" sx={{ 
							margin: '0 8px', 
							border: '1px solid #FFF', 
							color: 'text.secondary',
							width: 40,
							height: 40 }} onClick={handleEmail}>
							<EmailIcon />
						</IconButton>
						<IconButton color="secondary" size="small" sx={{ 
							margin: '0 8px', 
							border: '1px solid #FFF', 
							color: 'text.secondary',
							width: 40,
							height: 40 }} onClick={handleTwitter}>
							<img src={twitterSVG}  style={{ 
								width: 24,
								height: 24 }} alt={"github"}/>
						</IconButton>
						<IconButton color="secondary" size="small" sx={{ 
							margin: '0 8px', 
							border: '1px solid #FFF', 
							color: 'text.secondary',
							width: 40,
							height: 40 }} onClick={handleGithub}>
							<img src={githubSVG} style={{ 
								width: 24,
								height: 24 }} alt={"github"}/>
						</IconButton>
					</Box>
					<Box sx={{ display: 'flex', padding: '24px 0', alignItems: 'center', flexWrap: 'wrap' }}>
						<Typography variant="body2" color="textSecondary" sx={{ marginRight: '16px' }}>
						© 2021 TurboFlakes
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ marginRight: '16px' }}>
							<Link href="/#/disclaimer" underline="none" color="inherit" >Disclaimer</Link>
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ marginRight: '16px' }}>
							<Link href="/#/privacy" underline="none" color="inherit" >Privacy Policy</Link>
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ marginRight: '16px' }}>
							<Link href="/#/terms" underline="none" color="inherit" >Terms of Use</Link>
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ marginRight: '16px' }}>
							<Link href="/#/cookies" underline="none" color="inherit" >Cookie Settings</Link>
						</Typography>
					</Box>
				</Container>
			</Box>
		)
	
}