import * as React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import WeightButtonGroup from './WeightButtonGroup';
import {
  selectBoardAddressesBySessionAndHash,
  selectSyncedSession,
  selectSyncedAtBlock
} from '../../features/api/boardsSlice';
import {
  selectBestBlock,
} from '../../features/api/blocksSlice';
import { getCriteriasHash } from '../../util/crypto'

const steps = ['Intro', 'Commission', 'Performance', 'Self Stake', 'Nominators Stake', 'Nominators Counter'];
const weightTexts = [
  {
    title: "Commission fee",
    titleDescription: "The commission fee is the cut charged by the Validator for their services.",
    question: "How much you prioritize a validator with lower commission than one with higher commission?",
    questionCaption: "In a scale of 0 to 5 - where 0 means that lower commission is not important and 5 the most important, please tick your weight."
  },
  {
    title: "Validator performance",
    titleDescription: "The performance is assessed by calculating the ratio of missed points to the total points that could have been obtained.",
    question: "How much you prioritize a validator with higher performance compared to one with lower performance?",
    questionCaption: "In a scale of 0 to 5 - where 0 means that higher performance is not important and 5 the most important, please tick your weight."
  },
  {
    title: "Self stake",
    titleDescription: "The validator self stake is the amount of funds the validator has bonded to their stash account. These funds are put at stake for the security of the network and are subject to potential slashing.",
    question: "How much you prioritize a validator with higher self stake compared to one with lower self stake?",
    questionCaption: "In a scale of 0 to 5 - where 0 means that higher self stake is not important and 5 the most important, please tick your weight."
  },
  {
    title: "Nominators stake",
    titleDescription: "The nominators stake is the total stake from ALL the nominators who nominate the validator. Similar to Validators self stake, these funds are put at stake for the security of the network and are subject to potential slashing.",
    question: "How much you prioritize a validator with higher nominators stake amount compared to one with lower nominators stake?",
    questionCaption: "In a scale of 0 to 5 - where 0 means that higher nominators stake is not important and 5 the most important, please tick your weight."
  },
  {
    title: "Nominators counter",
    titleDescription: "The nominators counter is the number of nominators backing a validator.",
    question: "How much you prioritize a validator with lower number of nominators compared to one with a higher number of nominators?",
    questionCaption: "In a scale of 0 to 5 - where 0 means that a low number of nominators is not important and 5 the most important, please tick your weight."
  }
];

function StepWelcome() {
  const theme = useTheme();
  const board_block_number = useSelector(selectSyncedAtBlock);
  const best_block = useSelector(selectBestBlock);
  const blocks_counter = !!best_block ? best_block.block_number - board_block_number : 0;
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection:'column', justifyContent: 'space-between'}}>
      <Box>
        <Box sx={{ mt: theme.spacing(2), minHeight: theme.spacing(20) }}>
          <Typography sx={{ fontFamily: 'Gilroy-Extrabold'}} variant="h2"  color='secondary'>WELCOME TO NOMI</Typography>
          <Typography variant="subtitle" color='secondary'>Craft your own criteria to better suit your nominations</Typography>
        </Box>
        <Typography color='secondary' variant='h5' gutterBottom>What is this?</Typography>
        <Typography sx={{ color: theme.palette.neutrals[200] }} paragraph>
        This tool — <b>NOMI</b> — is designed to actively involve Nominators in Native Staking offering a unique and enhanced nomination experience. It uses <Link href="https://en.wikipedia.org/wiki/Multiple-criteria_decision_analysis" target="_blank" rel="noreferrer" color="inherit">Multi-Criteria Decision Analysis</Link>, 
        which is an open and transparent approach for evaluating numerous conflicting traits in the decision-making process. For the analysis, validator data is collected at the last block of a session. The most recent synchronization occurred {`${blocks_counter}`} blocks ago. 
        </Typography>
        <Typography sx={{ color: theme.palette.neutrals[200] }} paragraph>
        <b>NOMI</b> takes into account five validator-specific traits and their weights, which are determined by your personal preferences. It's user-friendly and aims to help you focus on what truly matters and makes sense to you.
        </Typography>
        <Typography sx={{ color: theme.palette.neutrals[200] }} gutterBottom>
        So, let's get started :)
        </Typography>
      </Box>
    </Box>
  )
}

function StepWeight({title, titleDescription, question, questionCaption, value, onChange, showDark}) {
  const theme = useTheme();
  const [weight, setWeight] = React.useState(value);

  const handleOnChange = (evt, v) => {
    setWeight(v)
    onChange(evt, v)
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mt: theme.spacing(2), minHeight: theme.spacing(20) }}>
        <Typography color='secondary' variant='h3'>{title}</Typography>
        <Typography color='secondary' variant='subtitle'>
          {titleDescription}
          </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <Typography color='secondary' variant='h5' paragraph>
        {question}
        </Typography>
        {/* <Typography color='secondary' gutterBottom>
        {questionCaption}
        </Typography> */}
        <Box sx={{ mt: theme.spacing(5), mb: theme.spacing(3), display: 'flex'}} align="center">
          <WeightButtonGroup
            showDark={showDark}
            size="lg"
            onChange={(e, v) => handleOnChange(e, v)}
            value={weight}
          />
        </Box>
        <Typography sx={{ color: theme.palette.neutrals[200] }} color='secondary' variant='caption' gutterBottom>
        {questionCaption}
        </Typography>
      </Box>
    </Box>
  )
}

const getHashFromParams = (searchParams) => {
  const weights = searchParams.get("w").toString();
  const intervals = searchParams.get("i").toString();
  const filters = searchParams.get("f").toString();
  return getCriteriasHash(weights, intervals, filters)
}

function StepFinish({onClose, onReset}) {
  const theme = useTheme();
  let [searchParams, setSearchParams] = useSearchParams();
  const session = useSelector(selectSyncedSession);
  const addresses = useSelector((state) => selectBoardAddressesBySessionAndHash(state, session, getHashFromParams(searchParams)));

  React.useEffect(() => {
    let t = setTimeout(() => {
      onClose()
    }, 60000);
    
    return function cleanup() {
      if (t) {
        clearTimeout(t)
      }
    }

  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection:'column', justifyContent: 'space-between'}}>
      <Box>
        <Box sx={{ mt: theme.spacing(2), minHeight: theme.spacing(14) }}>
          <Typography sx={{ fontFamily: 'Gilroy-Extrabold'}} variant="h3"  color='secondary'>That's IT!</Typography>
          <Typography variant="subtitle" color='secondary'>{`See the bouncing DOTs in the background? As per your preferences, they represent the ${addresses.length} highest-ranked Validators.`}</Typography>
        </Box>
        <Typography color='secondary' variant='h5' gutterBottom>What can I do next?</Typography>
        <Typography sx={{ color: theme.palette.neutrals[200] }} variant='subtitle' paragraph>
        Each bouncing DOT is clickable — amoung other things you can obtain the identity and history performance about the validator. You can also include the validator in your list of nomination candidates and start the nomination process directly from this tool when you're ready.
        </Typography>
        <Typography color='secondary' variant='h5' gutterBottom>Can I change my preferences once more?</Typography>
        <Typography sx={{ color: theme.palette.neutrals[200] }} variant='subtitle' paragraph>
        Absolutely, feel free to <i>Reset</i> and iterate as many times as you wish, explore all the criterias, filters, and ranges available from the menus and toolbars in the background. <b>NOMI</b> is just another tool to help your own nomination research.
        </Typography>
        <Typography color='secondary' variant='h5' gutterBottom>Did you run into issues, or have questions?</Typography>
        <Typography sx={{ color: theme.palette.neutrals[200] }} variant='subtitle' paragraph>
        You can always report an issue <Link href="https://github.com/turboflakes/apps/issues" target="_blank" rel="noreferrer" color="inherit">here</Link>, send an email to <Link href="mailto:support@turboflakes.io" rel="noreferrer" color="inherit">support@turboflakes.io</Link> or reach me out on [matrix].
        </Typography>
        <Typography color='secondary' variant='h5' gutterBottom>Bonded less than the minimum to earn rewards?</Typography>
        <Typography sx={{ color: theme.palette.neutrals[200] }} paragraph>
        Nomination Pools are much more a better fit. Look for ONE-T Nomination Pools <Link href="https://one-t.turboflakes.io/#/polkadot" target="_blank" rel="noreferrer" color="inherit">here</Link> to find out more.
        </Typography>
        {/* <Typography color='secondary' variant='h5' gutterBottom>Do you enjoy this tool, or did it help you?</Typography>
        <Typography sx={{ color: theme.palette.neutrals[200] }} variant='subtitle' paragraph>
        You can always star the repository in <Link href="https://github.com/turboflakes/apps" target="_blank" rel="noreferrer" color="inherit">Github</Link> and help us share it with the Polkadot community and beyond.
        </Typography> */}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
        <Button sx={{ mr: 1 }} color='secondary' variant='outlined' onClick={onReset} >
          Reset
        </Button>
        <Button color='secondary' variant='contained' onClick={onClose} sx={{ mr: 1 }} >
          Close
        </Button>
      </Box>
    </Box>
  )
}

function getWeight(weights = "-1,-1,-1,-1,-1", index) {
  return parseInt(weights.split(",")[index])
}

export default function WelcomeStepper({onClose, showDark}) {
  const theme = useTheme();
  let [searchParams, setSearchParams] = useSearchParams();
  const [activeStep, setActiveStep] = React.useState(0);
  const [weights, setWeights] = React.useState([-1,-1,-1,-1,-1].toString());
  
  const handleOnChange = (evt, value, index) => {
    let temp = weights.split(",")
    temp[index] = value
    setWeights(temp.toString())
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      searchParams.set("w", weights)
      setSearchParams(searchParams)
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setWeights([-1,-1,-1,-1,-1].toString());
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
        <Stepper sx={{ minWidth: theme.spacing(10)}} activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            return (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column', width: '80%', height: '100%'}}>
      {activeStep === steps.length ? (
        <StepFinish onClose={onClose} onReset={handleReset} />
      ) : (
        <React.Fragment>
          { activeStep === 0 ? <StepWelcome /> : null }
          { activeStep === 1 ? <StepWeight 
            showDark={showDark}
            title={weightTexts[0].title} 
            titleDescription={weightTexts[0].titleDescription}
            question={weightTexts[0].question}
            questionCaption={weightTexts[0].questionCaption }
            value={getWeight(weights, 0)}
            onChange={(e, v) => handleOnChange(e, v, 0)} /> : null }
          { activeStep === 2 ? <StepWeight 
            showDark={showDark}
            title={weightTexts[1].title} 
            titleDescription={weightTexts[1].titleDescription}
            question={weightTexts[1].question}
            questionCaption={weightTexts[1].questionCaption } 
            value={getWeight(weights, 4)}
            onChange={(e, v) => handleOnChange(e, v, 4)} /> : null }
          { activeStep === 3 ? <StepWeight 
            showDark={showDark}
            title={weightTexts[2].title} 
            titleDescription={weightTexts[2].titleDescription}
            question={weightTexts[2].question}
            questionCaption={weightTexts[2].questionCaption } 
            value={getWeight(weights, 1)}
            onChange={(e, v) => handleOnChange(e, v, 1)} /> : null }
          { activeStep === 4 ? <StepWeight 
            showDark={showDark}
            title={weightTexts[3].title} 
            titleDescription={weightTexts[3].titleDescription}
            question={weightTexts[3].question}
            questionCaption={weightTexts[3].questionCaption } 
            value={getWeight(weights, 2)}
            onChange={(e, v) => handleOnChange(e, v, 2)} /> : null }
          { activeStep === 5 ? <StepWeight 
            showDark={showDark}
            title={weightTexts[4].title} 
            titleDescription={weightTexts[4].titleDescription}
            question={weightTexts[4].question}
            questionCaption={weightTexts[4].questionCaption } 
            value={getWeight(weights, 3)}
            onChange={(e, v) => handleOnChange(e, v, 3)} /> : null }
          <Box sx={{display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            {activeStep > 0 ?
              <Button
                  color='secondary' variant='outlined'
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button> : null}
            {/* <Box sx={{ flex: '1 1 auto' }} /> */}
            <Button color='secondary' variant='contained' 
              disabled={
                (getWeight(weights, 0) === -1 && activeStep === 1) || 
                (getWeight(weights, 4) === -1 && activeStep === 2) || 
                (getWeight(weights, 1) === -1 && activeStep === 3) || 
                (getWeight(weights, 2) === -1 && activeStep === 4) || 
                (getWeight(weights, 3) === -1 && activeStep === 5)
              }
              onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
        <Typography sx={{ position: 'absolute', bottom: theme.spacing(1), color: theme.palette.neutrals[300]}} 
          color='secondary' variant='caption' gutterBottom>
            Disclaimer: NOMI is a complementary tool, always DYOR: Do Your Own Research.
        </Typography>
      </Box>
    </Box>
  );
}