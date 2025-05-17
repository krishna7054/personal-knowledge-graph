from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'notes',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('title')
    )
    op.create_table(
        'tags',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    op.create_table(
        'links',
        sa.Column('source_id', sa.Integer(), nullable=False),
        sa.Column('target_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['source_id'], ['notes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['target_id'], ['notes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('source_id', 'target_id')
    )
    op.create_table(
        'note_tags',
        sa.Column('note_id', sa.Integer(), nullable=False),
        sa.Column('tag_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['note_id'], ['notes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('note_id', 'tag_id')
    )

def downgrade():
    op.drop_table('note_tags')
    op.drop_table('links')
    op.drop_table('tags')
    op.drop_table('notes')