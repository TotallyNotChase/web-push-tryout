/**
 * Define model used for table `subscriptions`
 */
export interface ISubscription {
    readonly id: number;
    readonly subscription: string;
    readonly date_created: Date;
}
