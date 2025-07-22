import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tasks')
export class TaskEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  status: string;

  @Column()
  progress: number;

  @Column()
  total_tasks: number;

  @Column({ type: 'json', nullable: true })
  result: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}