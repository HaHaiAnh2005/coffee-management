import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  actionLabel: string;
  targetId?: string;
  oldValue?: string;
  newValue?: string;
  approvedBy?: string;
  reason?: string;
}

const AuditLogSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    timestamp: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    actionLabel: { type: String, required: true },
    targetId: { type: String },
    oldValue: { type: String },
    newValue: { type: String },
    approvedBy: { type: String },
    reason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
