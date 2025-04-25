import DateSearch from "./DateSearch";
import DropdownFilter from "./DropdownFilter";
import SearchBox from "./SearchBox";

const FilterBox = ({setSearchParams}) => {
  return (
    <div className="row x-gap-20 y-gap-20 items-center">
      <div className="col-auto">
        <SearchBox setSearchParams={setSearchParams}/>
      </div>
      {/* End col-auto */}
    </div>
  );
};

export default FilterBox;
