import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Link from "next/link";
import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
  AutocompleteRenderInputParams,
  Typography,
} from "@mui/material";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import { Method } from "axios";
import { throttle } from "lodash";

export interface AddressSearchProps {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  renderInput: (
    params: AutocompleteRenderInputParams & { helperText: React.ReactNode }
  ) => React.ReactNode;
  selectedAddress: Address | string | null;
  setSelectedAddress: Dispatch<SetStateAction<Address | string | null>>;
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => void;
}

export interface Address {
  address: string;
  id: string | number;
  latitude: number;
  longitude: number;
}

const AddressSearch: React.FC<AddressSearchProps> = (props) => {
  const {
    searchValue,
    setSearchValue,
    renderInput,
    selectedAddress,
    setSelectedAddress,
    onInputChange: _onInputChange,
  } = props;

  const defaultOnInputChange = useCallback(
    (
      event: React.SyntheticEvent,
      newInputValue: string,
      reason: AutocompleteInputChangeReason
    ) => setSearchValue(newInputValue),
    [setSearchValue]
  );

  const handleChange = useCallback(
    (
      event: React.SyntheticEvent,
      newValue: any,
      reason: AutocompleteChangeReason
    ) => {
      if (newValue?.id) {
        setSelectedAddress(newValue);
      }
      if (reason === "clear") {
        setSelectedAddress(null);
      }
    },
    [setSelectedAddress]
  );

  const onInputChange = useMemo(
    () => _onInputChange || defaultOnInputChange,
    [_onInputChange, defaultOnInputChange]
  );

  const [setRequestGetAddresses, isFetchingAddresses, addresses, setAddresses] =
    useAuthedApiCall<Array<Address>>({ requestInfo: {} as any });

  const fetchAddresses = useMemo(
    () =>
      throttle(async () => {
        setRequestGetAddresses({
          method: "get" as Method,
          url: `/public/australian-addresses?q=${searchValue}`,
        });
      }, 200),
    [searchValue, setRequestGetAddresses]
  );

  useEffect(() => {
    if (searchValue && !selectedAddress) {
      fetchAddresses();
    } else {
      setAddresses([]);
    }
  }, [fetchAddresses, searchValue, selectedAddress, setAddresses]);

  return (
    <Autocomplete
      id='address-search'
      freeSolo
      loading={isFetchingAddresses}
      filterOptions={(x) => x}
      onInputChange={onInputChange}
      onChange={handleChange}
      options={addresses || []}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.address
      }
      getOptionDisabled={(option) =>
        typeof option === "string" ? true : option.id === 0
      }
      fullWidth
      value={selectedAddress}
      renderInput={(params) =>
        renderInput({
          ...params,
          helperText: (
            <Typography variant='caption'>
              Powered by{" "}
              <Link href='https://australianaddresses.net.au'>
                Australian Address Search Tools
              </Link>
            </Typography>
          ),
        })
      }
    />
  );
};

export default AddressSearch;
