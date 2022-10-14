// next
import Image, { ImageProps } from "next/image";
import useApplicationContext from "hooks/useApplicationContext";

interface CarSpaceImageProps extends Omit<ImageProps, "src"> {
  src?: string;
}

const CarSpaceImage: React.FC<CarSpaceImageProps> = ({
  src,
  height,
  width,
  ...rest
}) => {
  const { darkMode } = useApplicationContext();

  return (
    <Image
      src={src || (darkMode ? "/No-Image-dark.png" : "/No-Image-light.png")}
      alt='Car space cover'
      height={height}
      width={width}
      objectFit='contain'
      {...rest}
    />
  );
};

export default CarSpaceImage;
