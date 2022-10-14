import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  Card,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { WeekDays } from "utils/constants";
import TabPanel, { a11yProps } from "components/TabPanel";
import { AvailableType, UnavailableType } from "models/CarSpace";

export interface AvailableBoxProps {
  unavailableType: UnavailableType;
  setUnavailableType: Dispatch<SetStateAction<UnavailableType>>;
  unavailableDate: Date | null;
  setUnavailableDate: Dispatch<SetStateAction<Date | null>>;
  unavailableDates: Date[];
  setUnavailableDates: Dispatch<SetStateAction<Date[]>>;
  unavailableFromDate: Date | null;
  setUnavailableFromDate: Dispatch<SetStateAction<Date | null>>;
  unavailableToDate: Date | null;
  setUnavailableToDate: Dispatch<SetStateAction<Date | null>>;
  availableType: AvailableType;
  setAvailableType: Dispatch<SetStateAction<AvailableType>>;
  availableFromTime: Date | null;
  setAvailableFromTime: Dispatch<SetStateAction<Date | null>>;
  availableToTime: Date | null;
  setAvailableToTime: Dispatch<SetStateAction<Date | null>>;
  availableFromDate: Date | null;
  setAvailableFromDate: Dispatch<SetStateAction<Date | null>>;
  availableToDate: Date | null;
  setAvailableToDate: Dispatch<SetStateAction<Date | null>>;
  availableWeekDays: number[];
  setAvailableWeekDays: Dispatch<SetStateAction<number[]>>;
}

const AvailableBox: React.FC<AvailableBoxProps> = (props) => {
  const {
    unavailableType,
    setUnavailableType,
    unavailableDate,
    setUnavailableDate,
    unavailableDates,
    setUnavailableDates,
    unavailableFromDate,
    setUnavailableFromDate,
    unavailableToDate,
    setUnavailableToDate,
    availableType,
    setAvailableType,
    availableFromTime,
    setAvailableFromTime,
    availableToTime,
    setAvailableToTime,
    availableFromDate,
    setAvailableFromDate,
    availableToDate,
    setAvailableToDate,
    availableWeekDays,
    setAvailableWeekDays,
  } = props;

  const [expanded, setExpanded] = useState(false);
  const handleAvailableTypeChange = (
    event: React.SyntheticEvent,
    newValue: AvailableType
  ) => {
    setAvailableType(newValue);
  };
  const handleUnavailableTypeChange = (
    event: React.SyntheticEvent,
    newValue: UnavailableType
  ) => {
    setUnavailableDates([]);
    setUnavailableFromDate(null);
    setUnavailableToDate(null);
    setUnavailableType(newValue);
  };

  const handleDelete = (dateToDelete: Date) => () => {
    setUnavailableDates((dates) =>
      dates.filter(
        (date) => date.toLocaleString() !== dateToDelete.toLocaleString()
      )
    );
  };

  useEffect(() => {
    if (unavailableDates.length === 0) {
      setExpanded(false);
    }
  }, [unavailableDates.length]);

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded);
  };

  const handleWeekDayChange = useCallback(
    (day: number) => () => {
      setAvailableWeekDays((days) => {
        const newDays = [...days];
        if (newDays.includes(day)) {
          return newDays.filter((d) => d !== day);
        } else {
          newDays.push(day);
        }
        return newDays;
      });
    },
    [setAvailableWeekDays]
  );

  return (
    <Card>
      <Tabs
        value={availableType}
        onChange={handleAvailableTypeChange}
        aria-label='available type tabs'
        variant='fullWidth'
      >
        <Tab label='Always Available' {...a11yProps(AvailableType.ALWAYS)} />
        <Tab label='Custom Available' {...a11yProps(AvailableType.CUSTOM)} />
      </Tabs>
      <TabPanel value={availableType} index={AvailableType.ALWAYS}>
        <Typography>
          Your car space will be available 24/7 except the days you specify
          unavailable below
        </Typography>
      </TabPanel>
      <TabPanel value={availableType} index={AvailableType.CUSTOM}>
        <Stack spacing={2}>
          <Typography>
            You can specify the availability of your car space by setting the
            from/to time of a day, start/end date, and weekdays.
          </Typography>
          <TimePicker
            label='from time'
            value={availableFromTime}
            onChange={(newValue) => {
              setAvailableToTime(null);
              setAvailableFromTime(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <TimePicker
            label='to time'
            value={availableToTime}
            disabled={!availableFromTime}
            minTime={availableFromTime}
            onChange={(newValue) => {
              setAvailableToTime(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <ButtonGroup fullWidth>
            {WeekDays.map((d) => (
              <Button
                key={d.value}
                onClick={handleWeekDayChange(d.value)}
                variant={
                  availableWeekDays.includes(d.value) ? "contained" : undefined
                }
              >
                {d.label}
              </Button>
            ))}
          </ButtonGroup>
          <DatePicker
            label='start date'
            inputFormat='dd/MM/yyyy'
            disablePast
            value={availableFromDate}
            onChange={(newValue) => {
              setAvailableFromDate(newValue);
              setAvailableToDate(null);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            disablePast
            label='end date'
            inputFormat='dd/MM/yyyy'
            value={availableToDate}
            minDate={availableFromDate}
            disabled={!availableFromDate}
            onChange={(newValue) => {
              if (newValue) {
                setAvailableToDate(newValue);
              }
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </TabPanel>
      <Divider />
      <Tabs
        value={unavailableType}
        onChange={handleUnavailableTypeChange}
        aria-label='unavailable type tabs'
        variant='fullWidth'
      >
        <Tab label='Range Unavailable' {...a11yProps(UnavailableType.RANGE)} />
        <Tab
          label='Picker Unavailable'
          {...a11yProps(UnavailableType.PICKER)}
        />
      </Tabs>
      <TabPanel value={unavailableType} index={UnavailableType.RANGE}>
        <Stack spacing={2}>
          <DatePicker
            label='from'
            inputFormat='dd/MM/yyyy'
            disablePast
            value={unavailableFromDate}
            onChange={(newValue) => {
              setUnavailableFromDate(newValue);
              setUnavailableToDate(null);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            disablePast
            label='to'
            inputFormat='dd/MM/yyyy'
            value={unavailableToDate}
            minDate={unavailableFromDate}
            disabled={!unavailableFromDate}
            onChange={(newValue) => {
              if (newValue) {
                setUnavailableToDate(newValue);
              }
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </TabPanel>
      <TabPanel value={unavailableType} index={UnavailableType.PICKER}>
        <StaticDatePicker
          disablePast
          displayStaticWrapperAs='desktop'
          value={unavailableDate}
          onChange={(newValue) => {
            setExpanded(true);
            setUnavailableDate(newValue);
            setUnavailableDates((dates) => {
              const newDates = [...dates];
              if (
                newValue &&
                newDates.filter((date) => date.getTime() === newValue.getTime())
                  .length === 0
              ) {
                newDates.push(newValue);
              }
              return newDates;
            });
          }}
          renderInput={(params) => <TextField {...params} />}
          renderDay={(day, _value, DayComponentProps) => {
            if (!unavailableDate) {
              return <PickersDay {...DayComponentProps} />;
            }
            const isUnavailable =
              unavailableDates.filter(
                (date) => date.toLocaleString() === day.toLocaleString()
              ).length > 0;

            return (
              <PickersDay
                {...DayComponentProps}
                selected={false}
                sx={{
                  backgroundColor: isUnavailable ? "red!important" : undefined,
                  color: isUnavailable ? "white!important" : undefined,
                  ":hover": {
                    backgroundColor: isUnavailable ? "error.dark" : undefined,
                  },
                }}
              />
            );
          }}
        />
        <Accordion expanded={expanded} onChange={handleAccordionChange}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography>Unavailable Dates</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                p: 0.5,
                m: 0,
              }}
            >
              {unavailableDates
                .sort((a, b) => a.getTime() - b.getTime())
                .map((d, i) => (
                  <Chip
                    key={i}
                    onDelete={handleDelete(d)}
                    label={d.toLocaleDateString("en-au")}
                  />
                ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </TabPanel>

      <Divider />
    </Card>
  );
};

export default AvailableBox;
