export interface Promotion {
    _id?:       string;
    code:       string;
    startDate:  Date | null;
    endDate:    Date | null;
    quantity:   number;
    type:       number;
    repeat:     number;
    date?:      string;
    discount?:  string;
    deleted?:   boolean;
}





