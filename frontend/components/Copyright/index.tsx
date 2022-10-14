import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://github.com/unsw-cse-comp3900-9900-22T2/capstone-project-9900-w14p-nobug/">
          Where2Park
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }