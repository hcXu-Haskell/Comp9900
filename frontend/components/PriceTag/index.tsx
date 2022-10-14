import { Typography } from "@mui/material";

export interface PriceTagProps {
  price: number;
  discount: number;
}

const PriceTag: React.FC<PriceTagProps> = (props) => {
  const { price, discount } = props;
  // discount = 0 means no discount, 10 means 10% off
  if (discount === 0) {
    return (
      <Typography align='center' variant='h6'>
        A${price}
      </Typography>
    );
  } else {
    return (
      <>
        <Typography align='center' color='red'>
          <del>A${price}</del>
        </Typography>
        <Typography align='center' variant='h6'>
          A${Math.round(Number(price) * (1 - discount / 100) * 100) / 100}
        </Typography>
      </>
    );
  }
};

export default PriceTag;
