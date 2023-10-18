import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import WeightButtonGroup from './WeightButtonGroup';

const steps = ['Intro', 'Commission', 'Performance', 'Self Stake', 'Nominators Stake', 'Nominators Counter'];

function Step0() {
  return (
    <Box>
      <Typography color='secondary' variant='h5'>What is this?</Typography>
      <Typography color='secondary' paragraph>
      This tool — <b>NOMI</b> — aims to engage Nominators in active staking and improve the nomination experience. It uses <Link href="https://en.wikipedia.org/wiki/Multiple-criteria_decision_analysis" target="_blank" rel="noreferrer" color="inherit">Multi-Criteria Decision Analysis</Link>, 
      which is an open and transparent way of evaluating multiple conflicting traits in decision making.
      </Typography>
      <Typography color='secondary' paragraph>
      <b>NOMI</b> takes into account five validator-specific traits and the level of importance assigned to each trait by you — The Nominator. It is easy to use and helps you to focus on what is important and logical to you.
      </Typography>
      <Typography color='secondary' gutterBottom>
      So, let's get started, shall we? :)
      </Typography>
      <Typography color='secondary' variant='caption' gutterBottom>Most up-to-date validator data synced at block #</Typography>
    </Box>
  )
}

function Step1() {
  const [weight, setWeight] = React.useState(-1);

  const handleOnChange = (evt, value) => {
    setWeight(value)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography color='secondary' variant='h5'>Commission fee</Typography>
      <Typography color='secondary' paragraph>
      The commission fee is the cut charged by the Validator for their services.
      </Typography>
      <Typography color='secondary' variant='h5'>
      How much you prioritize a validator with lower commission than one with higher commission?
      </Typography>
      <Typography color='secondary' gutterBottom>
      In a scale of 0 to 5 - where 0 means that a low commission is not important and 5 the most important thing, please pick your weight.
      </Typography>
      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} align="center">
        <WeightButtonGroup
          showDark
          size="lg"
          onChange={(e, v) => handleOnChange(e, v)}
          value={weight}
        />
      </Box>
    </Box>
  )
}

function Step2() {
  const [weight, setWeight] = React.useState(-1);

  const handleOnChange = (evt, value) => {
    setWeight(value)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography color='secondary' variant='h5'>Validator performance</Typography>
      <Typography color='secondary' paragraph>
      The performance is assessed by calculating the ratio of missed points to the total points that could have been obtained.
      </Typography>
      <Typography color='secondary' variant='h5'>
      How much you prioritize a validator with higher performance than one with lower performance?
      </Typography>
      <Typography color='secondary' gutterBottom>
      In a scale of 0 to 5 - where 0 means that a high performance is not important and 5 the most important thing, please pick your weight.
      </Typography>
      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} align="center">
        <WeightButtonGroup
          showDark
          size="lg"
          onChange={(e, v) => handleOnChange(e, v)}
          value={weight}
        />
      </Box>
    </Box>
  )
}

function Step3() {
  const [weight, setWeight] = React.useState(-1);

  const handleOnChange = (evt, value) => {
    setWeight(value)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography color='secondary' variant='h5'>Self stake</Typography>
      <Typography color='secondary' paragraph>
      The validator self stake is the amount of funds the validator has bonded to their stash account. These funds are put at stake for the security of the network and are subject to potential slashing.
      </Typography>
      <Typography color='secondary' variant='h5'>
      How much you prioritize a validator with higher self stake than one with lower self stake?
      </Typography>
      <Typography color='secondary' gutterBottom>
      In a scale of 0 to 5 - where 0 means that higher self stake is not important and 5 the most important thing, please pick your weight.
      </Typography>
      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} align="center">
        <WeightButtonGroup
          showDark
          size="lg"
          onChange={(e, v) => handleOnChange(e, v)}
          value={weight}
        />
      </Box>
    </Box>
  )
}

function Step4() {
  const [weight, setWeight] = React.useState(-1);

  const handleOnChange = (evt, value) => {
    setWeight(value)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography color='secondary' variant='h5'>Self stake</Typography>
      <Typography color='secondary' paragraph>
      The validator self stake is the amount of funds the validator has bonded to their stash account. These funds are put at stake for the security of the network and are subject to potential slashing.
      </Typography>
      <Typography color='secondary' variant='h5'>
      How much you prioritize a validator with higher self stake than one with lower self stake?
      </Typography>
      <Typography color='secondary' gutterBottom>
      In a scale of 0 to 5 - where 0 means that higher self stake is not important and 5 the most important thing, please pick your weight.
      </Typography>
      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} align="center">
        <WeightButtonGroup
          showDark
          size="lg"
          onChange={(e, v) => handleOnChange(e, v)}
          value={weight}
        />
      </Box>
    </Box>
  )
}

function Step5() {
  const [weight, setWeight] = React.useState(-1);

  const handleOnChange = (evt, value) => {
    setWeight(value)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography color='secondary' variant='h5'>Self stake</Typography>
      <Typography color='secondary' paragraph>
      The validator self stake is the amount of funds the validator has bonded to their stash account. These funds are put at stake for the security of the network and are subject to potential slashing.
      </Typography>
      <Typography color='secondary' variant='h5'>
      How much you prioritize a validator with higher self stake than one with lower self stake?
      </Typography>
      <Typography color='secondary' gutterBottom>
      In a scale of 0 to 5 - where 0 means that higher self stake is not important and 5 the most important thing, please pick your weight.
      </Typography>
      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} align="center">
        <WeightButtonGroup
          showDark
          size="lg"
          onChange={(e, v) => handleOnChange(e, v)}
          value={weight}
        />
      </Box>
    </Box>
  )
}

export default function WelcomeStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', width: '100%', height: '100%' }}>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }} color='secondary'>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button color='secondary' variant='contained' onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          { activeStep === 0 ? <Step0 /> : null }
          { activeStep === 1 ? <Step1 /> : null }
          { activeStep === 2 ? <Step2 /> : null }
          { activeStep === 3 ? <Step3 /> : null }
          { activeStep === 4 ? <Step4 /> : null }
          { activeStep === 5 ? <Step5 /> : null }
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color='secondary' variant='contained'
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button color='secondary' variant='contained' onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}

      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}