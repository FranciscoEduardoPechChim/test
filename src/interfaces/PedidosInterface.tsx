// Generated by https://quicktype.io

export interface PedidoIndividualResp {
  ok: boolean;
  msg: string;
  pedido: Pedido;
}

export interface Pedido {
  usuario: string | undefined | null;
  paquete: string | undefined;
  precio: number;
  importe: number;
  fechaPago: string;
  fechaVencimiento: string;
  metodoPago: string | undefined;
  vigencia: boolean;
  idPago: string | undefined;
  totalUsuarios?: number;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Item {
  id: string | null;
  object: string | null;
  billing_thresholds: string | null;
  created: number | null;
  metadata: any;
  price: {
    id: string | null;
    object: string | null;
    active: boolean;
    billing_scheme: string | null;
    created: number | null;
    currency: string | null;
    custom_unit_amount: number | null;
    livemode: boolean;
    lookup_key: string | null;
    metadata: any;
    nickname: string | null;
    product: string | null;
    recurring: {
      aggregate_usage: string | null;
      interval: string | null;
      interval_count: number | null;
      usage_type: string | null;
    },
    tax_behavior: string | null;
    tiers_mode: string | null;
    transform_quantity: string | null;
    type: string | null;
      unit_amount: number | null;
      unit_amount_decimal: string | null;
    };
    quantity: number | null;
    subscription: string | null;
    tax_rates: any
}

export interface Subcription {
  id:           string;
  object:       string;
  application:  string | null;
  application_fee_percent: string | null;
  automatic_tax: {
    enabled: boolean
  };
  billing_cycle_anchor: number;
  billing_thresholds: number | null;
  cancel_at: any;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  collection_method: string | null;
  created: number | null;
  currency: string | null;
  current_period_end: number | null;
  current_period_start: number | null;
  customer: string;
  days_until_due: number | null;
  default_payment_method: string | null;
  default_source: string | null;
  default_tax_rates: any;
  description: string | null;
  discount: number | null;
  ended_at: number | null;
  items: {
    object: string;
    data: Item[];
    has_more: boolean;
    url: string | null;
  };
  latest_invoice: string | null;
  livemode: boolean;
  metadata: any;
  next_pending_invoice_item_invoice: string | null;
  on_behalf_of: string | null;
  pause_collection: string | null;
  payment_settings: {
    payment_method_options: string | null;
    payment_method_types: string | null;
    save_default_payment_method: string | null;
  };
  pending_invoice_item_interval: string | null;
  pending_setup_intent: string | null;
  pending_update: string | null;
  schedule: string | null;
  start_date: number | null;
  status: string | null;
  test_clock: string | null;
  transfer_data: string | null;
  trial_end: string | null;
  trial_start: string | null;
}